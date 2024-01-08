import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Client } from '@notionhq/client';
import notionConfig from '../common/configs/notion.config';

import { NotionAPILoader } from 'langchain/document_loaders/web/notionapi';
import { Document } from 'langchain/document';

import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { VectorDBQAChain } from 'langchain/chains';
import { OpenAI as OpenAiModel } from 'langchain/llms/openai';
import { aiConfig } from '../common/configs/ai-config.config';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { countTokens } from '../chat/chat.utils';
import { PINECONE_APP } from '../common/constants';
import { PineconeService } from '../vector-database/pinecone-service.service';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { NotionSaveToVectorStoreParamsDto } from './dto/notion-save-to-vector-store-params';

@Injectable()
export class NotionService {
  client: Client;

  constructor(
    private readonly notionDefaultConfig: ConfigType<typeof notionConfig>,
    private readonly aiDefaultConfig: ConfigType<typeof aiConfig>,
    @Inject(PINECONE_APP) private readonly pineconeService: PineconeService
  ) {
    const notion = new Client({ auth: this.notionDefaultConfig.notionApiKey });

    this.client = notion;
  }

  async getNotionDocsFromQuery(input: string) {
    const response = await this.client.search({
      query: input,
      page_size: 2,
    });

    const promises = response.results.map((result) => {
      return new NotionAPILoader({
        clientOptions: {
          auth: this.notionDefaultConfig.notionApiKey,
        },
        id: result.id,
        type: result.object,
      }).load();
    });

    const resultsResponses = await Promise.all(promises);
    const docs: Document[] = [];

    resultsResponses.forEach((results) => {
      results.forEach((result) => {
        docs.push(
          new Document({
            pageContent: result.pageContent,
            metadata: result.metadata,
          })
        );
      });
    });

    return resultsResponses;
  }

  async processNotionIndividialDocs() {}

  // Search through all the docs from notion
  async search(input: string) {
    const response = await this.client.search({
      query: input,
    });

    const promises = response.results.map((result) => {
      return new NotionAPILoader({
        clientOptions: {
          auth: this.notionDefaultConfig.notionApiKey,
        },
        id: result.id,
        type: result.object,
      }).load();
    });

    const resultsResponses = await Promise.all(promises);
    const docs: Document[] = [];

    resultsResponses.forEach((results) => {
      results.forEach((result) => {
        docs.push(
          new Document({
            pageContent: result.pageContent,
            metadata: result.metadata,
          })
        );
      });
    });

    const splitter = new RecursiveCharacterTextSplitter({
      chunkOverlap: 100,
      chunkSize: 500,
      lengthFunction: countTokens,
    });

    const splittedDocs = (await splitter.splitDocuments(docs)).map(
      (doc) =>
        new Document({
          pageContent: doc.pageContent,
          metadata: doc.metadata,
        })
    );

    console.log(resultsResponses);

    const vectorStore = await MemoryVectorStore.fromDocuments(
      splittedDocs,
      new OpenAIEmbeddings()
    );

    const model = new OpenAiModel({
      openAIApiKey: this.aiDefaultConfig.openApiKey,
    });

    const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
      k: 6,
      returnSourceDocuments: true,
    });

    const aiResponse = await chain.call({
      query: input,
    });

    return aiResponse;
  }

  async savePageOrDatabseToVectorStore(
    params: NotionSaveToVectorStoreParamsDto
  ) {
    try {
      const { type, notionPageOrDatabaseId } = params;
      const pineconeIndex = this.pineconeService.client.Index('sample-index');

      const docs = await new NotionAPILoader({
        clientOptions: {
          auth: this.notionDefaultConfig.notionApiKey,
        },
        id: notionPageOrDatabaseId,
        type: type,
      }).load();

      docs.forEach((doc) => {
        docs.push(
          new Document({
            pageContent: doc.pageContent,
            metadata: doc.metadata,
          })
        );
      });

      const splitter = new RecursiveCharacterTextSplitter({
        chunkOverlap: 100,
        chunkSize: 500,
        lengthFunction: countTokens,
      });

      const splittedDocs = (await splitter.splitDocuments(docs)).map(
        (doc) =>
          new Document({
            pageContent: doc.pageContent,
            metadata: doc.metadata,
          })
      );

      await PineconeStore.fromDocuments(
        splittedDocs,
        new OpenAIEmbeddings({
          openAIApiKey: this.aiDefaultConfig.openApiKey,
        }),
        {
          pineconeIndex,
          maxConcurrency: 5,
          // namespace: randomString,
        }
      );

      return docs;
    } catch (error) {
      console.log(error);
    }
  }
}
