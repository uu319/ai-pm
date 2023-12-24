import { Module } from '@nestjs/common';

import { WarmupController } from './warmup.controller';

@Module({
  controllers: [WarmupController],
})
export class WarmupModule {}
