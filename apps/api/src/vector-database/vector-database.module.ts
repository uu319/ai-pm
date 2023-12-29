import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { aiConfig } from '../common/configs/ai-config.config';
import { pineconeProvider } from './providers/pinecone.provider';

@Module({
  imports: [ConfigModule.forFeature(aiConfig)],
  providers: [pineconeProvider],
  exports: [pineconeProvider],
})
export class VectorDatabaseModule {}
