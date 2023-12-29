import { ConfigType } from '@nestjs/config';

import { PINECONE_APP } from '../../common/constants';
import { aiConfig } from '../../common/configs/ai-config.config';
import { PineconeService } from '../pinecone-service.service';

export const pineconeProvider = {
  provide: PINECONE_APP,
  useFactory: (aiDefaultConfig: ConfigType<typeof aiConfig>) => {
    return new PineconeService(aiDefaultConfig);
  },
  inject: [aiConfig.KEY],
};
