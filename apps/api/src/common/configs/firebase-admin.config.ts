import { registerAs } from '@nestjs/config';
import * as admin from 'firebase-admin';

export const firebaseAdminConfig = registerAs<admin.AppOptions>(
  'firebase-admin',
  async () => {
    const config = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    };

    return {
      credential: admin.credential.cert({
        projectId: config.projectId,
        privateKey: config.privateKey,
        clientEmail: config.clientEmail,
      }),
      databaseURL: config.databaseURL,
    };
  }
);
