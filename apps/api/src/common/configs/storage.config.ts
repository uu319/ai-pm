import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  firebaseBucket: process.env.FIREBASE_BUCKET,
  firebaseBucketBasePath: process.env.FIREBASE_BUCKET_BASE_PATH,
}));
