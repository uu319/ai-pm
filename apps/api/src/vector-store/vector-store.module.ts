import { Module } from '@nestjs/common';
import { VectorStoreController } from './vector-store.controller';
import { VectorStoreService } from './vector-store.service';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { aiConfig } from '../common/configs/ai-config.config';
import { firebaseAdminConfig } from '../common/configs/firebase-admin.config';

@Module({
  imports: [
    MulterModule.register(),
    ConfigModule.forFeature(aiConfig),
    ConfigModule.forFeature(firebaseAdminConfig),
  ],
  controllers: [VectorStoreController],
  providers: [VectorStoreService],
})
export class VectorStoreModule {}
