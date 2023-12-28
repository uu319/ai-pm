import { ChatOpenAI } from 'langchain/chat_models/openai';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { BufferMemory } from 'langchain/memory';
import { RunnableBranch, RunnableSequence } from 'langchain/schema/runnable';
import { PromptTemplate } from 'langchain/prompts';
import { StringOutputParser } from 'langchain/schema/output_parser';
import { LLMChain } from 'langchain/chains';
import { formatDocumentsAsString } from 'langchain/util/document';
import { Inject, Injectable } from '@nestjs/common';
import { aiConfig } from '../common/configs/ai-config.config';
import chatConfig from '../common/configs/chat.config';
import { ConfigType } from '@nestjs/config';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from 'langchain/vectorstores/pinecone';

@Injectable()
export class ChatConversationService {
  constructor(
    @Inject(aiConfig.KEY)
    private readonly aiDefaultConfig: ConfigType<typeof aiConfig>,
    @Inject(chatConfig.KEY)
    private readonly chatDefaultConfig: ConfigType<typeof chatConfig>
  ) {}
  async converse(input: string) {
    /* Initialize the LLM to use to answer the question */
    const model = new ChatOpenAI({
      openAIApiKey: this.aiDefaultConfig.openApiKey,
    });

    const serializeChatHistory = (chatHistory: string | Array<string>) => {
      if (Array.isArray(chatHistory)) {
        return chatHistory.join('\n');
      }
      return chatHistory;
    };

    const pinecone = new Pinecone({
      apiKey: this.aiDefaultConfig.pineconeApiKey,
      environment: this.aiDefaultConfig.pineconeEnvironment,
    });

    const pineconeIndex = pinecone.Index('sample-index');

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({
        openAIApiKey: this.aiDefaultConfig.openApiKey,
      }),

      { pineconeIndex }
    );

    const retriever = vectorStore.asRetriever();

    const memory = new BufferMemory({
      memoryKey: 'chatHistory',
    });

    /**
     * Create a prompt template for generating an answer based on context and
     * a question.
     *
     * Chat history will be an empty string if it's the first question.
     *
     * inputVariables: ["chatHistory", "context", "question"]
     */
    const questionPrompt = PromptTemplate.fromTemplate(
      `
            Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.
            ----------------
            CHAT HISTORY: {chatHistory}
            ----------------
            CONTEXT: {context}
            ----------------
            QUESTION: {question}
            ----------------
            Helpful Answer:
        `
    );

    /**
     * Creates a prompt template for __generating a question__ to then ask an LLM
     * based on previous chat history, context and the question.
     *
     * inputVariables: ["chatHistory", "question"]
     */
    const questionGeneratorTemplate = PromptTemplate.fromTemplate(
      `
            Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.
            ----------------
            CHAT HISTORY: {chatHistory}
            ----------------
            FOLLOWUP QUESTION: {question}
            ----------------
            Standalone question:
        `
    );

    const handleProcessQuery = async (input: {
      question: string;
      context: string;
      chatHistory?: string | Array<string>;
    }) => {
      const chain = new LLMChain({
        llm: model,
        prompt: questionPrompt,
        outputParser: new StringOutputParser(),
      });

      const { text } = await chain.call({
        ...input,
        chatHistory: serializeChatHistory(input.chatHistory ?? ''),
      });

      await memory.saveContext(
        {
          human: input.question,
        },
        {
          ai: text,
        }
      );

      return text;
    };

    const answerQuestionChain = RunnableSequence.from([
      {
        question: (input: {
          question: string;
          chatHistory?: string | Array<string>;
        }) => input.question,
      },
      {
        question: (previousStepResult: {
          question: string;
          chatHistory?: string | Array<string>;
        }) => previousStepResult.question,
        chatHistory: (previousStepResult: {
          question: string;
          chatHistory?: string | Array<string>;
        }) => serializeChatHistory(previousStepResult.chatHistory ?? ''),
        context: async (previousStepResult: {
          question: string;
          chatHistory?: string | Array<string>;
        }) => {
          console.log('fetching...');
          // Fetch relevant docs and serialize to a string.
          const relevantDocs = await retriever.getRelevantDocuments(
            previousStepResult.question
          );

          const serialized = formatDocumentsAsString(relevantDocs);
          return serialized;
        },
      },
      handleProcessQuery,
    ]);

    const generateQuestionChain = RunnableSequence.from([
      {
        question: (input: {
          question: string;
          chatHistory: string | Array<string>;
        }) => input.question,
        chatHistory: async () => {
          const memoryResult = await memory.loadMemoryVariables({});
          return serializeChatHistory(memoryResult.chatHistory ?? '');
        },
      },
      questionGeneratorTemplate,
      model,
      // Take the result of the above model call, and pass it through to the
      // next RunnableSequence chain which will answer the question
      {
        question: (previousStepResult: { text: string }) =>
          previousStepResult.text,
      },
      answerQuestionChain,
    ]);

    const branch = RunnableBranch.from([
      [
        async () => {
          const memoryResult = await memory.loadMemoryVariables({});
          const isChatHistoryPresent = !memoryResult.chatHistory.length;

          return isChatHistoryPresent;
        },
        answerQuestionChain,
      ],
      [
        async () => {
          const memoryResult = await memory.loadMemoryVariables({});
          const isChatHistoryPresent =
            !!memoryResult.chatHistory && memoryResult.chatHistory.length;

          return isChatHistoryPresent;
        },
        generateQuestionChain,
      ],
      answerQuestionChain,
    ]);

    const fullChain = RunnableSequence.from([
      {
        question: (input: { question: string }) => input.question,
      },
      branch,
    ]);

    await fullChain.invoke({
      question: input,
    });

    const resultOne = await fullChain.invoke({
      question: 'Who has the age of 26?',
    });

    return resultOne;
  }
}
