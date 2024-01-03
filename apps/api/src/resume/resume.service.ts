import { Inject, Injectable } from '@nestjs/common';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { CharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { PineconeClient } from '@pinecone-database/pinecone';
import { loadSummarizationChain } from 'langchain/chains';
import { PINECONE_APP } from '../common/constants';
import { PineconeService } from '../vector-database/pinecone-service.service';
import { OpenAI } from 'langchain/llms/openai';
import { aiConfig } from '../common/configs/ai-config.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class ResumeService {
  constructor(
    @Inject(PINECONE_APP) private readonly pineconeService: PineconeService,
    @Inject(aiConfig.KEY)
    private readonly aiDefaultConfig: ConfigType<typeof aiConfig>
  ) {}
  async uploadResume(file: Express.Multer.File) {
    const pineconeIndex = this.pineconeService.client.Index('sample-index');

    const blob = new Blob([file.buffer]);
    const loader = new PDFLoader(blob);

    const docs = await loader.load();

    console.log('docs', docs);

    const openAi = new OpenAI({
      openAIApiKey: this.aiDefaultConfig.openApiKey,
    });

    // Grab the prompt from the url (?prompt=[value])
    //   console.log(process.env.PINECONE_API_KEY);
    //   console.log(process.env.PINECONE_ENVIRONMENT);
    //   console.log(process.env.PINECONE_INDEX);
    // Always use a try catch block to do asynchronous requests and catch any errors
    // try {
    //   //   3
    //   // console.log(`Loaded ${docs.length}`);

    //   // Split the documents with their metadata
    //   const splitter = new CharacterTextSplitter({
    //     separator: ' ',
    //     chunkSize: 200,
    //     chunkOverlap: 20,
    //   });

    //   //
    //   const splitDocs = await splitter.splitDocuments(docs);

    //   // console.log(`Split Docs: ${splitDocs.length}`);

    //   // console.log(docs[0]);
    //   // console.log(splitDocs[0]);

    //   // reduce the metadata and make it more searchable
    //   const reducedDocs = splitDocs.map((doc) => {
    //     // ["Users", "shawnesquivel", ... "resume_aubrey_graham.pdf"]
    //     const fileName = doc.metadata.source.split('/').pop();
    //     // ["resume", "aubrey", "graham.pdf"]
    //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //     const [_, firstName, lastName] = fileName.split('_');

    //     return {
    //       ...doc,
    //       metadata: {
    //         first_name: firstName,
    //         last_name: lastName.slice(0, -4),
    //         docType: 'resume',
    //       },
    //     };
    //   });

    //   // console.log(reducedDocs[4]);
    //   const summaries = [];
    //   const model = new OpenAI({ temperature: 0 });
    //   const summarizeAllChain = loadSummarizationChain(model, {
    //     type: 'map_reduce',
    //   });

    //   // raw documents
    //   const summarizeRes = await summarizeAllChain.call({
    //     input_documents: docs,
    //   });

    //   summaries.push({ summary: summarizeRes.text });

    //   /** Summarize each candidate */

    //   summaries = docs.map(async (doc) => {
    //     const summarizeOneChain = loadSummarizationChain(model, {
    //       type: 'map_reduce',
    //     });
    //     const summarizeOneRes = await summarizeOneChain.call({
    //       input_documents: [doc],
    //     });

    //     console.log({ summarizeOneRes });
    //     summaries.push({ summary: summarizeOneRes.text });
    //   });

    //   /** Upload the reducedDocs */
    //   const client = new PineconeClient();
    //   await client.init({
    //     apiKey: process.env.PINECONE_API_KEY,
    //     environment: process.env.PINECONE_ENVIRONMENT,
    //   });

    //   await PineconeStore.fromDocuments(reducedDocs, new OpenAIEmbeddings(), {
    //     pineconeIndex,
    //   });

    //   console.log('Uploaded to Pinecone');

    //   console.log({ summaries });
    //   // [{summary: 'gdajkljgadkl'}, {summary: 'gdjaklgkadl'}]
    //   const summaryStr = JSON.stringify(summaries, null, 2);

    //   return res.status(200).json({ output: summaryStr });
    // } catch (err) {
    //   // If we have an error

    //   console.error(err);
    //   return res.status(500).json({ error: err });
    // }
  }
}
