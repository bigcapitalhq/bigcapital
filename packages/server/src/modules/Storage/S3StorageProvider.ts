import { randomUUID } from 'node:crypto';
import * as multerS3 from 'multer-s3';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { StorageEngine } from 'multer';
import {
  StorageProvider,
  StorageGetResult,
  PresignedUrlOptions,
} from './StorageProvider';

/**
 * S3-backed storage provider. Wraps the existing S3 integration with no
 * behavioral change — callers that were using S3 directly will see identical
 * results through this provider.
 */
export class S3StorageProvider extends StorageProvider {
  private readonly bucket: string;

  constructor(
    private readonly s3Client: S3Client,
    private readonly configService: ConfigService,
  ) {
    super();
    this.bucket = this.configService.get<string>('s3.bucket');
  }

  /**
   * Creates a multer-s3 storage engine.
   */
  createMulterStorage(getOrganizationId: () => string): StorageEngine {
    return multerS3({
      s3: this.s3Client,
      bucket: this.bucket,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        const organizationId = getOrganizationId();
        if (!organizationId) {
          return cb(
            new Error('Tenant context required for upload.'),
            undefined as any,
          );
        }
        cb(null, `${organizationId}/${randomUUID()}`);
      },
      acl: function (req, file, cb) {
        cb(null, 'public-read');
      },
    });
  }

  /**
   * Retrieves an object from S3.
   */
  async getObject(key: string): Promise<StorageGetResult> {
    const data = await this.s3Client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
    const bytes = await data.Body.transformToByteArray();

    return {
      body: Buffer.from(bytes),
      contentType: data.ContentType,
    };
  }

  /**
   * Returns a time-limited presigned S3 URL for downloading the object.
   */
  async getPresignedUrl(
    key: string,
    options?: PresignedUrlOptions,
  ): Promise<string> {
    let ResponseContentDisposition = 'attachment';
    if (options?.originalName) {
      ResponseContentDisposition += `; filename="${options.originalName}"`;
    }
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ResponseContentDisposition,
    });
    return getSignedUrl(this.s3Client, command, {
      expiresIn: options?.expiresIn || 300,
    });
  }

  /**
   * Deletes an object from S3.
   */
  async deleteObject(key: string): Promise<void> {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  /**
   * Validates that the required S3 configuration is present.
   */
  validate(): void {
    const config = this.configService.get('s3');
    const missingKeys: string[] = [];

    if (!config.region) missingKeys.push('S3_REGION');
    if (!config.accessKeyId) missingKeys.push('S3_ACCESS_KEY_ID');
    if (!config.secretAccessKey) missingKeys.push('S3_SECRET_ACCESS_KEY');

    if (missingKeys.length > 0) {
      throw new Error(
        `S3 storage configuration error: missing ${missingKeys.join(', ')}`,
      );
    }
  }
}
