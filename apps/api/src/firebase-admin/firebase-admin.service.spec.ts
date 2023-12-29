import { ConfigType } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import * as admin from 'firebase-admin';
import { firebaseAdminConfig } from '../common/configs/firebase-admin.config';

import { FirebaseAdminService } from './firebase-admin.service';

jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
}));

describe('FirebaseAdminService', () => {
  let firebaseAdminService: FirebaseAdminService;
  let firebaseConfig: ConfigType<typeof firebaseAdminConfig>;

  beforeEach(async () => {
    firebaseConfig = {
      // Mock your firebase admin configuration here
      // ...
    };

    (admin.initializeApp as jest.Mock).mockReturnValue({
      // Mock the Firebase app instance
      // ...
    });

    const moduleRef = await Test.createTestingModule({
      providers: [
        FirebaseAdminService,
        {
          provide: firebaseAdminConfig.KEY,
          useValue: firebaseConfig,
        },
      ],
    }).compile();

    firebaseAdminService =
      moduleRef.get<FirebaseAdminService>(FirebaseAdminService);
  });

  it('should initialize Firebase admin app', () => {
    const firebaseApp = admin.initializeApp as jest.Mock;
    expect(firebaseApp).toHaveBeenCalled();
  });

  it('should return the Firebase admin app instance', () => {
    const firebaseAppInstance = firebaseAdminService.firebaseAdmin();
    expect(firebaseAppInstance).toBeDefined();
    // Add more assertions or specific tests related to the Firebase admin app instance
  });
});
