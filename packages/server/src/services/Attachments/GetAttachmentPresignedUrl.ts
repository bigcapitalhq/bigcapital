import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from '@/lib/S3/S3';
import { Service } from 'typedi';

@Service()
export class getAttachmentPresignedUrl {
  /**
   * Retrieves the presigned url of the given attachment key.
   * @param {string} key 
   * @returns {Promise<string?>}
   */
  async getPresignedUrl(key: string) {
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: key,
      Expires: 60 * 5, // 5 minutes
    };
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: key,
    });
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    return signedUrl;
  }
}
