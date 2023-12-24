import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { FirebaseAdminService } from './firebase-admin.service';
import { firebaseAdminConfig } from '../common/configs/firebase-admin.config';

@Module({
  imports: [ConfigModule.forFeature(firebaseAdminConfig)],
  providers: [FirebaseAdminService],
  exports: [FirebaseAdminService],
})
export class FirebaseAdminModule {}
