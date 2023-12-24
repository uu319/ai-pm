import { Injectable } from '@nestjs/common';
import pdf from '@cyber2024/pdf-parse-fixed';
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { CharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from 'langchain/document';

// This is a hack to make Multer available in the Express namespace

@Injectable()
export class VectorStoreService {
  /**
   * Process the given file and store its content in the vector store.
   * @param file - The file to be processed.
   * @returns A promise that resolves when the file has been processed.
   */
  async save(file: Express.Multer.File): Promise<void> {
    const parsedPdf = await pdf(file.buffer);

    const splitted = new CharacterTextSplitter({
      chunkSize: 20000,
      chunkOverlap: 500,
    });

    const textArray = await splitted.splitText(parsedPdf.text);
    const pinecone = new Pinecone();

    const randomString = Math.random().toString(36).substring(2, 9);

    const documents = textArray.map(
      (text) =>
        new Document({
          pageContent: text,
          metadata: {
            projectId: randomString,
          },
        })
    );

    const pineconeIndex = pinecone.Index('sample-index');

    await PineconeStore.fromDocuments(documents, new OpenAIEmbeddings(), {
      pineconeIndex,
      maxConcurrency: 5,
      // namespace: randomString,
    });
  }

  /**
   * Query the vector store for similarity to the given query.
   * @param query - The query string for similarity search.
   * @returns A promise that resolves with the search results.
   */
  async queryFromEmbeding(query: string) {
    const pinecone = new Pinecone();

    const pineconeIndex = pinecone.Index('sample-index');

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings(),
      { pineconeIndex }
    );

    const results = await vectorStore.similaritySearch(query, 1, {});

    return results;
  }
}
