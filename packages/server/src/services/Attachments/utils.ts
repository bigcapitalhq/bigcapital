import path from 'path';
import config from '@/config';


export const getUploadedObjectUri = (objectKey: string) => {
  return path.join(config.s3.endpoint, config.s3.bucket, objectKey);
}