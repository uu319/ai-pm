import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { FirebaseAdminService } from '../../firebase-admin/firebase-admin.service';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentUser?: DecodedIdToken;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly firebaseAdminService: FirebaseAdminService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];
    if (token) {
      const tokenString = token.replace('Bearer ', '');
      const firebaseApp = this.firebaseAdminService.getFirebaseAdmin();

      const user = await firebaseApp.auth().verifyIdToken(tokenString);

      if (user) {
        req.currentUser = user;
      }
    }

    next();
  }
}
