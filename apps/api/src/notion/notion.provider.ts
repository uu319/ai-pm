import { ConfigType } from '@nestjs/config';

import { NOTION_APP } from '../common/constants';
import { NotionService } from './notion.service';
import notionConfig from '../common/configs/notion.config';
import { aiConfig } from '../common/configs/ai-config.config';

export const notionProvider = {
  provide: NOTION_APP,
  useFactory: (
    notionDefaultConfig: ConfigType<typeof notionConfig>,
    aiDefaultConfig: ConfigType<typeof aiConfig>
  ) => {
    return new NotionService(notionDefaultConfig, aiDefaultConfig);
  },
  inject: [notionConfig.KEY, aiConfig.KEY],
};
