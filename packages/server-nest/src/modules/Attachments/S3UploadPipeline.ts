import { NextFunction, Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AttachmentUploadPipeline {
  constructor(
    private readonly configService: ConfigService
  ) {}

  /**
   * Middleware to ensure that S3 configuration is properly set before proceeding.
   * This function checks if the necessary S3 configuration keys are present and throws an error if any are missing.
   * @param req The HTTP request object.
   * @param res The HTTP response object.
   * @param next The callback to pass control to the next middleware function.
   */
  public validateS3Configured(req: Request, res: Response, next: NextFunction) {
    const config = this.configService.get('s3');

    if (
      !config.region ||
      !config.accessKeyId ||
      !config.secretAccessKey
    ) {
      const missingKeys = [];
      if (!config.region) missingKeys.push('region');
      if (!config.accessKeyId) missingKeys.push('accessKeyId');
      if (!config.secretAccessKey) missingKeys.push('secretAccessKey');
      const missing = missingKeys.join(', ');

      throw new Error(`S3 configuration error: Missing ${missing}`);
    }
    next();
  }
}
