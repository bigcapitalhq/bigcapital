import { Service } from 'typedi';
import { s3 } from '@/lib/S3/S3';
import { GetObjectCommand } from '@aws-sdk/client-s3';

@Service()
export class GetAttachment {
  /**
   * Retrieves data of the given document key.
   * @param {number} tenantId
   * @param {string} filekey
   */
  async getAttachment(tenantId: number, filekey: string) {
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: filekey,
    };
    const data = await s3.send(new GetObjectCommand(params));

    return data;
  }
}
