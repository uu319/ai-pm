import { randomUUID } from 'crypto';

import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as admin from 'firebase-admin';

import { firebaseAdminConfig } from '../common/configs/firebase-admin.config';

@Injectable()
export class FirebaseAdminService {
  private readonly firebaseApp: admin.app.App;

  constructor(
    @Inject(firebaseAdminConfig.KEY)
    private readonly firebaseConfig: ConfigType<typeof firebaseAdminConfig>
  ) {
    this.firebaseApp = admin.initializeApp(this.firebaseConfig, randomUUID());
  }

  getFirebaseAdmin(): admin.app.App {
    return this.firebaseApp;
  }
}
