import 'multer';
import { Inject, Injectable } from '@nestjs/common';
import { FirebaseAdminService } from '../firebase-admin/firebase-admin.service';
import { ConfigType } from '@nestjs/config';
import storageConfig from '../common/configs/storage.config';

@Injectable()
export class StorageService {
  constructor(
    private readonly firebaseAdminService: FirebaseAdminService,
    @Inject(storageConfig.KEY)
    private storageDefaultConfig: ConfigType<typeof storageConfig>
  ) {}

  async uploadFile(multerFile: Express.Multer.File): Promise<string> {
    const bucket = this.firebaseAdminService.bucket();

    const file = bucket.file(
      `${this.storageDefaultConfig.firebaseBucketBasePath}/${multerFile.originalname}`
    );

    await file.save(multerFile.buffer);

    const signedUrl = await file.getSignedUrl({
      action: 'read',
      expires: new Date('2040-03-25'),
    });

    return signedUrl[0];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getFile(path: string): Promise<Buffer> {
    const bucket = this.firebaseAdminService.bucket();
    const file = bucket.file(path);
    const [buffer] = await file.download();

    return buffer;
  }
}
