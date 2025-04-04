import { Module } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

export const S3_CLIENT = 'S3_CLIENT';

const services = [
  {
    provide: S3_CLIENT,
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
