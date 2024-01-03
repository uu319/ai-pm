import { ConfigType } from '@nestjs/config';

import { NOTION_APP, PINECONE_APP } from '../common/constants';
import { NotionService } from './notion.service';
import notionConfig from '../common/configs/notion.config';
import { aiConfig } from '../common/configs/ai-config.config';
import { PineconeService } from '../vector-database/pinecone-service.service';

export const notionProvider = {
  provide: NOTION_APP,
  useFactory: (
    notionDefaultConfig: ConfigType<typeof notionConfig>,
    aiDefaultConfig: ConfigType<typeof aiConfig>,
    pineconeProvider: PineconeService
  ) => {
    return new NotionService(
      notionDefaultConfig,
      aiDefaultConfig,
      pineconeProvider
    );
  },
  inject: [notionConfig.KEY, aiConfig.KEY, PINECONE_APP],
};
