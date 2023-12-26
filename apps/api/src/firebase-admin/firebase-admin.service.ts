import { randomUUID } from 'crypto';

import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as admin from 'firebase-admin';

import { firebaseAdminConfig } from '../common/configs/firebase-admin.config';
import storageConfigObject from '../common/configs/storage.config';

@Injectable()
export class FirebaseAdminService {
  private readonly firebaseApp: admin.app.App;

  constructor(
    @Inject(firebaseAdminConfig.KEY)
    private readonly firebaseConfig: ConfigType<typeof firebaseAdminConfig>,

    @Inject(storageConfigObject.KEY)
    private storageConfig: ConfigType<typeof storageConfigObject>
  ) {
    this.firebaseApp = admin.initializeApp(this.firebaseConfig, randomUUID());
  }

  getFirebaseAdmin(): admin.app.App {
    return this.firebaseApp;
  }

  bucket() {
    return this.firebaseApp.storage().bucket(this.storageConfig.firebaseBucket);
  }
}
