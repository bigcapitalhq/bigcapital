import path from 'path';
import config from '@/config';

export const getUploadedObjectUri = (objectKey: string) => {
  return new URL(
    path.join(config.s3.bucket, objectKey),
    config.s3.endpoint
  ).toString();
};
