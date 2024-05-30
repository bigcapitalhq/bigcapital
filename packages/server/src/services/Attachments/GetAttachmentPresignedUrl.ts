import { Service } from 'typedi';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from '@/lib/S3/S3';
import config from '@/config';

@Service()
export class getAttachmentPresignedUrl {
  /**
   * Retrieves the presigned url of the given attachment key.
   * @param {string} key
   * @returns {Promise<string?>}
   */
  async getPresignedUrl(key: string) {
    const command = new GetObjectCommand({
      Bucket: config.s3.bucket,
      Key: key,
    });
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    return signedUrl;
  }
}
