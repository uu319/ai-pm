import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { firebaseAdminConfig } from '../common/configs/firebase-admin.config';
import storageConfig from '../common/configs/storage.config';
import { firebaseAdminProvider } from './firebase-admin.provider';

@Module({
  imports: [
    ConfigModule.forFeature(firebaseAdminConfig),
    ConfigModule.forFeature(storageConfig),
  ],
  providers: [firebaseAdminProvider],
  exports: [firebaseAdminProvider],
})
export class FirebaseAdminModule {}
