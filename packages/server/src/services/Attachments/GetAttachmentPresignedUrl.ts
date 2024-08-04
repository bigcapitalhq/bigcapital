import { Inject, Service } from 'typedi';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from '@/lib/S3/S3';
import config from '@/config';
import HasTenancyService from '../Tenancy/TenancyService';

@Service()
export class getAttachmentPresignedUrl {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Retrieves the presigned url of the given attachment key with the original filename.
   * @param {number} tenantId
   * @param {string} key
   * @returns {string}
   */
  async getPresignedUrl(tenantId: number, key: string) {
    const { Document } = this.tenancy.models(tenantId);
    const foundDocument = await Document.query().findOne({ key });

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
