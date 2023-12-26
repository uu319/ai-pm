import { Module } from '@nestjs/common';
import { VectorStoreController } from './vector-store.controller';
import { VectorStoreService } from './vector-store.service';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { aiConfig } from '../common/configs/ai-config.config';
import { firebaseAdminConfig } from '../common/configs/firebase-admin.config';
import storageConfig from '../common/configs/storage.config';
import { StorageService } from '../storage/storage.service';
import { FirebaseAdminService } from '../firebase-admin/firebase-admin.service';

@Module({
  imports: [
    MulterModule.register(),
    ConfigModule.forFeature(aiConfig),
    ConfigModule.forFeature(firebaseAdminConfig),
    ConfigModule.forFeature(storageConfig),
  ],
  controllers: [VectorStoreController],
  providers: [VectorStoreService, StorageService, FirebaseAdminService],
})
export class VectorStoreModule {}
