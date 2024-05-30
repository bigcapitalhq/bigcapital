import { Service } from 'typedi';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '@/lib/S3/S3';
import config from '@/config';

@Service()
export class GetAttachment {
  /**
   * Retrieves data of the given document key.
   * @param {number} tenantId
   * @param {string} filekey
   */
  async getAttachment(tenantId: number, filekey: string) {
    const params = {
      Bucket: config.s3.bucket,
      Key: filekey,
    };
    const data = await s3.send(new GetObjectCommand(params));

    return data;
  }
}
