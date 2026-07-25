import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { StorageProvider } from './StorageProvider';
import { S3StorageProvider } from './S3StorageProvider';
import { LocalStorageProvider } from './LocalStorageProvider';
import { S3_CLIENT, S3Module } from '../S3/S3.module';

export const STORAGE_PROVIDER = 'STORAGE_PROVIDER';

/**
 * Dynamic module that provides a `StorageProvider` implementation based on
 * the `STORAGE_PROVIDER` environment variable.
 *
 * - `s3` (default): wraps the existing S3 client — identical behavior to
 *   the previous hardcoded integration.
 * - `local`: stores files on the local filesystem at `LOCAL_STORAGE_PATH`.
 *
 * Usage:
 *   imports: [StorageModule.register()]
 *   inject:  [@Inject(STORAGE_PROVIDER) storage: StorageProvider]
 */
@Module({})
export class StorageModule {
  static register(): DynamicModule {
    const provider = process.env.STORAGE_PROVIDER || 's3';

    if (provider === 'local') {
      return {
        module: StorageModule,
        providers: [
          {
            provide: STORAGE_PROVIDER,
            inject: [ConfigService],
            useFactory: (config: ConfigService) =>
              new LocalStorageProvider(config),
          },
        ],
        exports: [STORAGE_PROVIDER],
      };
    }

    return {
      module: StorageModule,
      imports: [S3Module],
      providers: [
        {
          provide: STORAGE_PROVIDER,
          inject: [S3_CLIENT, ConfigService],
          useFactory: (s3: S3Client, config: ConfigService) =>
            new S3StorageProvider(s3, config),
        },
      ],
      exports: [STORAGE_PROVIDER],
    };
  }
}
