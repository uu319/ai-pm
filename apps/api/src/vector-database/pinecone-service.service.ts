import { Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { aiConfig } from '../common/configs/ai-config.config';
import { Pinecone } from '@pinecone-database/pinecone';

@Injectable()
export class PineconeService {
  client: Pinecone;

  constructor(private readonly aiDefaultConfig: ConfigType<typeof aiConfig>) {
    const pinecone = new Pinecone({
      apiKey: this.aiDefaultConfig.pineconeApiKey,
      environment: this.aiDefaultConfig.pineconeEnvironment,
    });

    this.client = pinecone;
  }
}
