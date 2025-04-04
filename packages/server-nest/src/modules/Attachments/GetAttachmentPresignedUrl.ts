import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { DocumentModel } from './models/Document.model';

@Injectable()
export class getAttachmentPresignedUrl {
  constructor(
    private readonly documentModel: TenantModelProxy<typeof DocumentModel>
  ) {}

  /**
   * Retrieves the presigned url of the given attachment key with the original filename.
   * @param {number} tenantId
   * @param {string} key
   * @returns {string}
   */
  async getPresignedUrl(tenantId: number, key: string) {
    const foundDocument = await this.documentModel().query().findOne({ key });

    let ResponseContentDisposition = 'attachment';
    if (foundDocument && foundDocument.originName) {
      ResponseContentDisposition += `; filename="${foundDocument.originName}"`;
    }

    const command = new GetObjectCommand({
      Bucket: config.s3.bucket,
      Key: key,
      ResponseContentDisposition,
    });
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    return signedUrl;
  }
}
