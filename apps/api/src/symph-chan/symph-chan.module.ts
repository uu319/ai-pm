import { Module } from '@nestjs/common';
import { SymphChanService } from './symph-chan.service';
import { SymphChanController } from './symph-chan.controller';
import { ConfigModule } from '@nestjs/config';
import { aiConfig } from '../common/configs/ai-config.config';

@Module({
  imports: [ConfigModule.forFeature(aiConfig)],
  controllers: [SymphChanController],
  providers: [SymphChanService],
  exports: [SymphChanService],
})
export class SymphChanModule {}
