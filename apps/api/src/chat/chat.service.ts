import { Inject, Injectable } from '@nestjs/common';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { aiConfig } from '../common/configs/ai-config.config';
import { ConfigType } from '@nestjs/config';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import OpenAI from 'openai';
import { MAX_RESPONSE_TOKENS, trimMessages } from './chat.util';
import chatConfig from '../common/configs/chat.config';

@Injectable()
export class ChatService {
  constructor(
    @Inject(aiConfig.KEY)
    private readonly aiDefaultConfig: ConfigType<typeof aiConfig>,
    @Inject(chatConfig.KEY)
    private readonly chatDefaultConfig: ConfigType<typeof chatConfig>
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

    const results = await vectorStore.similaritySearchWithScore(input, 6, {});

    if (results.length > 0) {
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

  async summarize() {}

  async converse() {}
}
