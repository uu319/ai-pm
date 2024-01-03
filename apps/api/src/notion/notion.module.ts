import { Module } from '@nestjs/common';
import { NotionController } from './notion.controller';
import { notionProvider } from './notion.provider';
import { ConfigModule } from '@nestjs/config';
import notionConfig from '../common/configs/notion.config';
import { aiConfig } from '../common/configs/ai-config.config';
import { VectorDatabaseModule } from '../vector-database/vector-database.module';

@Module({
  imports: [
    ConfigModule.forFeature(notionConfig),
    ConfigModule.forFeature(aiConfig),
    VectorDatabaseModule,
  ],
  providers: [notionProvider],
  exports: [notionProvider],
  controllers: [NotionController],
})
export class NotionModule {}
