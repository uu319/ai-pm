import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { FirebaseAdminService } from './firebase-admin.service';
import { firebaseAdminConfig } from '../common/configs/firebase-admin.config';
import storageConfig from '../common/configs/storage.config';

@Module({
  imports: [
    ConfigModule.forFeature(firebaseAdminConfig),
    ConfigModule.forFeature(storageConfig),
  ],
  providers: [FirebaseAdminService],
  exports: [FirebaseAdminService],
})
export class FirebaseAdminModule {}
