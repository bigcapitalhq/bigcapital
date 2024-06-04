import multer from 'multer';
import type { Multer } from 'multer';
import multerS3 from 'multer-s3';
import { s3 } from '@/lib/S3/S3';
import { Service } from 'typedi';
import config from '@/config';
import { NextFunction, Request, Response } from 'express';

@Service()
export class AttachmentUploadPipeline {
  /**
   * Middleware to ensure that S3 configuration is properly set before proceeding.
   * This function checks if the necessary S3 configuration keys are present and throws an error if any are missing.
   *
   * @param req The HTTP request object.
   * @param res The HTTP response object.
   * @param next The callback to pass control to the next middleware function.
   */
  public validateS3Configured(req: Request, res: Response, next: NextFunction) {
    if (
      !config.s3.region ||
      !config.s3.accessKeyId ||
      !config.s3.secretAccessKey
    ) {
      const missingKeys = [];
      if (!config.s3.region) missingKeys.push('region');
      if (!config.s3.accessKeyId) missingKeys.push('accessKeyId');
      if (!config.s3.secretAccessKey) missingKeys.push('secretAccessKey');
      const missing = missingKeys.join(', ');

      throw new Error(`S3 configuration error: Missing ${missing}`);
    }
    next();
  }

  /**
   * Express middleware for uploading attachments to an S3 bucket.
   * It utilizes the multer middleware for handling multipart/form-data, specifically for file uploads.
   */
  public uploadPipeline(): Multer {
    return multer({
      storage: multerS3({
        s3,
        bucket: config.s3.bucket,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
          cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
          cb(null, Date.now().toString());
        },
      }),
    });
  }
}
