import { Module } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

export const S3_CLIENT = 'S3_CLIENT';

const services = [
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
