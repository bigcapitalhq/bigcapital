import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '@/lib/S3/S3';
import { Service } from 'typedi';

@Service()
export class DeleteAttachment {
  /**
   * Deletes the give file attachment file key.
   * @param {number} tenantId
   * @param {string} filekey
   */
  async delete(tenantId: number, filekey: string): Promise<void> {
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: filekey,
    };
    await s3.send(new DeleteObjectCommand(params));
  }
}
