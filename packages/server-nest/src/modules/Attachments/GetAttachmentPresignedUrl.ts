import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { DocumentModel } from './models/Document.model';
import { ConfigService } from '@nestjs/config';
import { S3_CLIENT } from '../S3/S3.module';

@Injectable()
export class getAttachmentPresignedUrl {
  constructor(
    private readonly configService: ConfigService,
    
    @Inject(DocumentModel.name)
    private readonly documentModel: TenantModelProxy<typeof DocumentModel>,

    @Inject(S3_CLIENT)
    private readonly s3Client: S3Client,
  ) {}

  /**
   * Retrieves the presigned url of the given attachment key with the original filename.
   * @param {string} key - 
   * @returns {string}
   */
  async getPresignedUrl(key: string) {
    const foundDocument = await this.documentModel().query().findOne({ key });
    const config = this.configService.get('s3');

    let ResponseContentDisposition = 'attachment';
    if (foundDocument && foundDocument.originName) {
      ResponseContentDisposition += `; filename="${foundDocument.originName}"`;
    }
    const command = new GetObjectCommand({
      Bucket: config.bucket,
      Key: key,
      ResponseContentDisposition,
    });
    const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 300 });

    return signedUrl;
  }
}
