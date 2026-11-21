import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectsCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3_CLIENT } from './S3.constants';

export interface S3UploadObject {
  key: string;
  body: Buffer | Uint8Array | string;
  contentType?: string;
}

export interface S3PresignedUrlOptions {
  expiresIn?: number;
  inline?: boolean;
}

@Injectable()
export class S3StorageService {
  private readonly logger = new Logger(S3StorageService.name);

  constructor(
    @Inject(S3_CLIENT)
    private readonly s3Client: S3Client,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Retrieves the configured S3 bucket name.
   * @returns {string}
   */
  private get bucket(): string {
    return this.configService.get('s3.bucket');
  }

  /**
   * Uploads the given object to S3.
   * @param {S3UploadObject} upload - The object to upload.
   * @returns {Promise<void>}
   */
  public async uploadObject(upload: S3UploadObject): Promise<void> {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: upload.key,
        Body: upload.body,
        ContentType: upload.contentType,
        ACL: 'public-read',
      }),
    );
  }

  /**
   * Deletes the given objects from S3, best-effort.
   * @param {string[]} keys - S3 object keys.
   * @returns {Promise<void>}
   */
  public async deleteObjects(keys: string[]): Promise<void> {
    const uniqueKeys = [...new Set(keys.filter(Boolean))];
    if (uniqueKeys.length === 0) {
      return;
    }
    try {
      await this.s3Client.send(
        new DeleteObjectsCommand({
          Bucket: this.bucket,
          Delete: {
            Objects: uniqueKeys.map((key) => ({ Key: key })),
            Quiet: true,
          },
        }),
      );
    } catch (error) {
      this.logger.warn(
        `Failed to delete S3 objects: ${uniqueKeys.join(', ')}`,
        error instanceof Error ? error.stack : undefined,
      );
    }
  }

  /**
   * Retrieves a presigned URL for the given S3 object key.
   * @param {string} key - S3 object key.
   * @param {S3PresignedUrlOptions} options - Presign options.
   * @returns {Promise<string>}
   */
  public async getPresignedUrl(
    key: string,
    options: S3PresignedUrlOptions = {},
  ): Promise<string> {
    const { expiresIn = 3600, inline = true } = options;

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ResponseContentDisposition: inline ? 'inline' : 'attachment',
    });
    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  /**
   * Retrieves presigned URLs for the given S3 object keys.
   * Failing keys are mapped to null instead of failing the whole batch.
   * @param {string[]} keys - S3 object keys.
   * @param {S3PresignedUrlOptions} options - Presign options.
   * @returns {Promise<Record<string, string | null>>}
   */
  public async getPresignedUrls(
    keys: string[],
    options: S3PresignedUrlOptions = {},
  ): Promise<Record<string, string | null>> {
    const uniqueKeys = [...new Set(keys.filter(Boolean))];
    const results = await Promise.allSettled(
      uniqueKeys.map((key) => this.getPresignedUrl(key, options)),
    );
    return uniqueKeys.reduce<Record<string, string | null>>(
      (urls, key, index) => {
        const result = results[index];
        urls[key] = result.status === 'fulfilled' ? result.value : null;
        return urls;
      },
      {},
    );
  }
}
