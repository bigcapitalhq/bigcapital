import { Module } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { S3StorageService } from './S3Storage.service';
import { S3_CLIENT } from './S3.constants';

export { S3_CLIENT } from './S3.constants';

const services = [
  S3StorageService,
  {
    provide: S3_CLIENT,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const config = configService.get('s3');

      return new S3Client({
        region: config.region,
        credentials: {
          accessKeyId: config.accessKeyId,
          secretAccessKey: config.secretAccessKey,
        },
        endpoint: config.endpoint,
        forcePathStyle: config.forcePathStyle,
      });
    },
  },
];
@Module({
  providers: [...services],
  exports: [...services],
})
export class S3Module {}
