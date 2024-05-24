import { Service } from 'typedi';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Service()
export class UploadDocument {

  async upload(tenantId: number, file: any) {
    
  }
}
