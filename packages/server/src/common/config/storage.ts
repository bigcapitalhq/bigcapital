import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  provider: process.env.STORAGE_PROVIDER || 's3',
  localPath: process.env.LOCAL_STORAGE_PATH || '/data/attachments',
}));
