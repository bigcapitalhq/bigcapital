import multer from 'multer';
import multerS3 from 'multer-s3';
import { s3 } from '@/lib/S3/S3';
import { Service } from 'typedi';

@Service()
export class AttachmentUploadPipeline {
  uploadPipeline() {
    return multer({
      storage: multerS3({
        s3,
        bucket: process.env.AWS_BUCKET,
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
