import { Inject, Injectable } from '@nestjs/common';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { aiConfig } from '../common/configs/ai-config.config';
import { ConfigType } from '@nestjs/config';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import OpenAI from 'openai';
import { MAX_RESPONSE_TOKENS, trimMessages } from './chat.util';

@Injectable()
export class ChatService {
  constructor(
    @Inject(aiConfig.KEY)
    private readonly aiDefaultConfig: ConfigType<typeof aiConfig>
  ) {}

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
            You are a helpful AI assistant. Your knowledge is enriched by this document:
            ---
            ${resultContent}
            ---
            When possible, explain the reasoning for your responses based on this knowledge.
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

  async converse() {}

  async summarize() {}
}
