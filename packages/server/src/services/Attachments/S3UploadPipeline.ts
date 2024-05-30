import multer from 'multer';
import type { Multer } from 'multer'
import multerS3 from 'multer-s3';
import { s3 } from '@/lib/S3/S3';
import { Service } from 'typedi';
import config from '@/config';

@Service()
export class AttachmentUploadPipeline {
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
