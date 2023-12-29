import { Module } from '@nestjs/common';
import { VectorStoreController } from './vector-store.controller';
import { VectorStoreService } from './vector-store.service';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { aiConfig } from '../common/configs/ai-config.config';
import { firebaseAdminConfig } from '../common/configs/firebase-admin.config';
import storageConfig from '../common/configs/storage.config';
import { StorageService } from '../storage/storage.service';
import { FirebaseAdminModule } from '../firebase-admin/firebase-admin.module';
import { VectorDatabaseModule } from '../vector-database/vector-database.module';

@Module({
  imports: [
    MulterModule.register(),
    ConfigModule.forFeature(aiConfig),
    ConfigModule.forFeature(firebaseAdminConfig),
    ConfigModule.forFeature(storageConfig),
    FirebaseAdminModule,
    VectorDatabaseModule,
  ],
  controllers: [VectorStoreController],
  providers: [VectorStoreService, StorageService],
})
export class VectorStoreModule {}
