import { Inject, Injectable } from '@nestjs/common';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { aiConfig } from '../common/configs/ai-config.config';
import { ConfigType } from '@nestjs/config';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import OpenAI from 'openai';
import chatConfig from '../common/configs/chat.config';
import { VectorDBQAChain, loadSummarizationChain } from 'langchain/chains';
import { OpenAI as OpenAiModel } from 'langchain/llms/openai';

import { PromptTemplate } from 'langchain/prompts';
import { TokenTextSplitter } from 'langchain/text_splitter';
import { Document } from 'langchain/document';
import { MAX_RESPONSE_TOKENS, trimMessages } from './chat.util';
import { PINECONE_APP } from '../common/constants';
import { PineconeService } from '../vector-database/pinecone-service.service';

@Injectable()
export class ChatService {
  constructor(
    @Inject(aiConfig.KEY)
    private readonly aiDefaultConfig: ConfigType<typeof aiConfig>,
    @Inject(chatConfig.KEY)
    private readonly chatDefaultConfig: ConfigType<typeof chatConfig>,
    @Inject(PINECONE_APP) private readonly pineconeService: PineconeService
  ) {}

  /**
   * Process the given input and generate a response using OpenAI's GPT-3.5 model.
   * @param input - The user input to be processed.
   * @returns A promise that resolves with the generated response.
   */
  async ask(input: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const systemMessage: any = {
      role: 'system',
      content: 'You are a helpful AI assistant',
    };
    const openAi = new OpenAI({ apiKey: this.aiDefaultConfig.openApiKey });

    const pineconeIndex = this.pineconeService.client.Index('sample-index');

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({
        openAIApiKey: this.aiDefaultConfig.openApiKey,
      }),

      { pineconeIndex }
    );

    const results = await vectorStore.similaritySearchWithScore(input, 1, {});

    if (results.length > 0) {
      results[0][0].metadata;
      const result = results[0];
      const resultContent = result[0].pageContent;
      const resultScore = result[1];

      if (resultScore > 0.5) {
        systemMessage.content = `
          ${this.chatDefaultConfig.pdfChatIntroSystemMessage}:
          ---
          ${resultContent}
          ---
          ${this.chatDefaultConfig.pdfChatReasoningSystemMessage}.
        `;
      }
      ``;
    }

    const response = await openAi.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0,
      max_tokens: MAX_RESPONSE_TOKENS,

      messages: trimMessages([systemMessage, { role: 'user', content: input }]),
    });

    return response;
  }

  async askUsingVectorQAChain(input: string) {
    const pineconeIndex = this.pineconeService.client.Index('sample-index');

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({
        openAIApiKey: this.aiDefaultConfig.openApiKey,
      }),

      { pineconeIndex }
    );

    const model = new OpenAiModel();

    const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
      k: 6,
      returnSourceDocuments: true,
    });

    const response = await chain.call({ query: input });

    return response;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async summarizeDocs(docs: Document<Record<string, any>>[]) {
    const splitter = new TokenTextSplitter({
      chunkSize: 10000,
      chunkOverlap: 250,
    });

    const docsSummary = await splitter.splitDocuments(docs);

    const model = new OpenAiModel({
      openAIApiKey: this.aiDefaultConfig.openApiKey,
      temperature: 0,
    });

    const summaryTemplate = `
    You are an expert in summarizing large piece of document.
    Your goal is to create a summary of a large document.
    Below you find the content of a large document:
    --------
    {text}
    --------
    
    The summary will also be used as the basis for a question and answer bot.
    
    Total output will be a summary of the documents and a list of example questions the user could ask of the documents.
    
    SUMMARY AND QUESTIONS:
    `;

    const SUMMARY_PROMPT = PromptTemplate.fromTemplate(summaryTemplate);

    // const summaryRefineTemplate = `
    // You are an expert in summarizing large piece of document.
    // Your goal is to create a summary of a large document.
    // We have provided an existing summary up to a certain point: {existing_answer}

    // Below you find the transcript of a podcast:
    // --------
    // {text}
    // --------

    // Given the new context, refine the summary and example questions.
    // The transcript of the podcast will also be used as the basis for a question and answer bot.
    // Provide some examples questions and answers that could be asked about the podcast. Make
    // these questions very specific.
    // If the context isn't useful, return the original summary and questions.
    // Total output will be a summary of the video and a list of example questions the user could ask of the video.

    // SUMMARY AND QUESTIONS:
    // `;

    // const SUMMARY_REFINE_PROMPT = PromptTemplate.fromTemplate(
    //   summaryRefineTemplate
    // );

    const summarizeChain = loadSummarizationChain(model, {
      type: 'refine',
      verbose: true,
      questionPrompt: SUMMARY_PROMPT,
    });

    const summary = await summarizeChain.run(docsSummary);

    return summary;
  }

  async converse() {}
}
