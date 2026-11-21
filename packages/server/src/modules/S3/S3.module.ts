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
      const { accessKeyId, secretAccessKey } = config;

      return new S3Client({
        region: config.region,
        // Static keys when both are set; otherwise the SDK's default credential
        // chain (EKS Pod Identity, IRSA, ECS task role, instance profile).
        ...(accessKeyId && secretAccessKey
          ? { credentials: { accessKeyId, secretAccessKey } }
          : {}),
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
