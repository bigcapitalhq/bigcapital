import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3_CLIENT } from '../S3/S3.module';

@Injectable()
export class GetAttachment {
  constructor(
    private readonly configService: ConfigService,

    @Inject(S3_CLIENT)
    private readonly s3: S3Client
  ) {

  }
  /**
   * Retrieves data of the given document key.
   * @param {number} tenantId
   * @param {string} filekey
   */
  async getAttachment(filekey: string) {
    const params = {
      Bucket: this.configService.get('s3.bucket'),
      Key: filekey,
    };
    const data = await this.s3.send(new GetObjectCommand(params));

    return data;
  }
}
