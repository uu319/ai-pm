import { Module } from '@nestjs/common';
import { NotionController } from './notion.controller';
import { notionProvider } from './notion.provider';
import { ConfigModule } from '@nestjs/config';
import notionConfig from '../common/configs/notion.config';
import { aiConfig } from '../common/configs/ai-config.config';

@Module({
  imports: [
    ConfigModule.forFeature(notionConfig),
    ConfigModule.forFeature(aiConfig),
  ],
  providers: [notionProvider],
  exports: [notionProvider],
  controllers: [NotionController],
})
export class NotionModule {}
