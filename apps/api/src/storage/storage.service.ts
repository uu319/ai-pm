import 'multer';
import { Injectable } from '@nestjs/common';
import { FirebaseAdminService } from '../firebase-admin/firebase-admin.service';

@Injectable()
export class StorageService {
  constructor(private readonly firebaseAdminService: FirebaseAdminService) {}

  async uploadFile(multerFile: Express.Multer.File): Promise<string> {
    try {
      const bucket = this.firebaseAdminService.bucket();
      const file = bucket.file(`uploads/${multerFile.originalname}`);

      await file.save(multerFile.buffer);

      const signedUrl = await file.getSignedUrl({
        action: 'read',
        expires: new Date('2040-03-25'),
      });

      return signedUrl[0];
    } catch (error) {
      console.log('Error on uploading file...');
      throw error;
    }
  }
}
