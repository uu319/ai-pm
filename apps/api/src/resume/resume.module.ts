import { Module } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { ResumeController } from './resume.controller';
import { pineconeProvider } from '../vector-database/providers/pinecone.provider';
import { ConfigModule } from '@nestjs/config';
import { aiConfig } from '../common/configs/ai-config.config';

@Module({
  imports: [ConfigModule.forFeature(aiConfig)],
  providers: [ResumeService, pineconeProvider],
  controllers: [ResumeController],
})
export class ResumeModule {}
