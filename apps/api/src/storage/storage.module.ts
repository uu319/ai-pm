import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { ConfigModule } from '@nestjs/config';
import storageConfig from '../common/configs/storage.config';
import { firebaseAdminConfig } from '../common/configs/firebase-admin.config';
import { StorageController } from './storage.controller';
import { FirebaseAdminModule } from '../firebase-admin/firebase-admin.module';

@Module({
  imports: [
    ConfigModule.forFeature(storageConfig),
    ConfigModule.forFeature(firebaseAdminConfig),
    FirebaseAdminModule,
  ],
  providers: [StorageService],
  exports: [StorageService],
  controllers: [StorageController],
})
export class StorageModule {}
