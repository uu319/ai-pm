import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { ConfigModule } from '@nestjs/config';
import storageConfig from '../common/configs/storage.config';
import { FirebaseAdminService } from '../firebase-admin/firebase-admin.service';
import { firebaseAdminConfig } from '../common/configs/firebase-admin.config';

@Module({
  imports: [
    ConfigModule.forFeature(storageConfig),
    ConfigModule.forFeature(firebaseAdminConfig),
  ],
  providers: [StorageService, FirebaseAdminService],
  exports: [StorageService],
})
export class StorageModule {}
