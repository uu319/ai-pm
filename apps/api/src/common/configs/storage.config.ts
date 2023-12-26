import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  firebaseBucket: process.env.FIREBASE_BUCKET,
}));
