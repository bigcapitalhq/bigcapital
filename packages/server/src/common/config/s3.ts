import { registerAs } from '@nestjs/config';

export default registerAs('s3', () => ({
  region: process.env.S3_REGION || 'US',
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  endpoint: process.env.S3_ENDPOINT,
  bucket: process.env.S3_BUCKET,
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
}));
