import { Service } from 'typedi';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Service()
export class UploadDocument {
  // setting up s3 client
  public s3 = new S3Client({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  async upload(data) {
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: data.filename,
      Body: await data.toBuffer(),
      ContentType: data.mimetype,
    });
    await this.s3.send(putObjectCommand);
  }
}
