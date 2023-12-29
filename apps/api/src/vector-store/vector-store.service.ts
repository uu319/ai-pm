import { Inject, Injectable } from '@nestjs/common';
import pdf from '@cyber2024/pdf-parse-fixed';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from 'langchain/document';
import { aiConfig } from '../common/configs/ai-config.config';
import { ConfigType } from '@nestjs/config';
import { firebaseAdminConfig } from '../common/configs/firebase-admin.config';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { countTokens } from '../chat/chat.utils';
import { PINECONE_APP } from '../common/constants';
import { PineconeService } from '../vector-database/pinecone-service.service';
// imports ChatCompletionMessageParam

// This is a hack to make Multer available in the Express namespace

@Injectable()
export class VectorStoreService {
  constructor(
    @Inject(aiConfig.KEY)
    private readonly aiDefaultConfig: ConfigType<typeof aiConfig>,
    @Inject(firebaseAdminConfig.KEY)
    private readonly firebaseConfig: ConfigType<typeof firebaseAdminConfig>,
    @Inject(PINECONE_APP) private readonly pineconeService: PineconeService
  ) {}
  /**
   * Process the given file and store its content in the vector store.
   * @param file - The file to be processed.
   * @returns A promise that resolves when the file has been processed.
   */
  async save(file: Express.Multer.File): Promise<void> {
    const parsedPdf = await pdf(file.buffer);

    const splitted = new RecursiveCharacterTextSplitter({
      chunkSize: 3000,
      chunkOverlap: 300,
      lengthFunction: countTokens,
      separators: ['\n\n', '\n', ' ', '', '---'],
    });

    const textArray = await splitted.splitText(parsedPdf.text);

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

    const pineconeIndex = this.pineconeService.client.Index('sample-index');

    await PineconeStore.fromDocuments(
      documents,
      new OpenAIEmbeddings({
        openAIApiKey: this.aiDefaultConfig.openApiKey,
      }),
      {
        pineconeIndex,
        maxConcurrency: 5,
        // namespace: randomString,
      }
    );
  }

  async saveUsingPdfLoader(file: Express.Multer.File) {
    const pineconeIndex = this.pineconeService.client.Index('sample-index');

    const blob = new Blob([file.buffer]);
    const loader = new PDFLoader(blob);

    const docs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 300,
      lengthFunction: countTokens,
      separators: ['\n\n', '\n', ' ', ''],
    });
    const splitDocs = await splitter.splitDocuments(docs);

    // Reduce the size of the metadata for each document -- lots of useless pdf information
    const reducedDocs = splitDocs.map((doc) => {
      const reducedMetadata = { ...doc.metadata };
      delete reducedMetadata.pdf; // Remove the 'pdf' field
      return new Document({
        pageContent: doc.pageContent,
        metadata: reducedMetadata,
      });
    });

    await PineconeStore.fromDocuments(
      reducedDocs,
      new OpenAIEmbeddings({
        openAIApiKey: this.aiDefaultConfig.openApiKey,
      }),
      {
        pineconeIndex,
        maxConcurrency: 5,
        // namespace: randomString,
      }
    );
  }
}
