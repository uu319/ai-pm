import { ConfigType } from '@nestjs/config';
import * as admin from 'firebase-admin';

import { firebaseAdminConfig } from '../common/configs/firebase-admin.config';
import { randomUUID } from 'crypto';
import { FirebaseAdminService } from './firebase-admin.service';
import storageConfig from '../common/configs/storage.config';
import { FIREBASE_APP } from '../common/constants';

export const firebaseAdminProvider = {
  provide: FIREBASE_APP,
  useFactory: (
    adminConfig: ConfigType<typeof firebaseAdminConfig>,
    storageDefaultConfig: ConfigType<typeof storageConfig>
  ) => {
    return new FirebaseAdminService(
      storageDefaultConfig,
      admin.initializeApp(adminConfig, randomUUID())
    );
  },
  inject: [firebaseAdminConfig.KEY, storageConfig.KEY],
};
