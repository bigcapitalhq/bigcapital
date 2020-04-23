
import express from 'express';
import { check, param, query, validationResult } from 'express-validator';
import fs from 'fs';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import TenancyMiddleware from '@/http/middleware/TenancyMiddleware';
import jwtAuth from '@/http/middleware/jwtAuth';
import Logger from '@/services/Logger';

const fsPromises = fs.promises;

export default {
  /**
   * Router constructor.
   */
  router() {
    const router = express.Router();

    router.use(jwtAuth);
    router.use(TenancyMiddleware);

    router.post('/upload',
      this.upload.validation,
      asyncMiddleware(this.upload.handler));

    router.delete('/delete/:id',
      this.delete.validation,
      asyncMiddleware(this.delete.handler));

    router.get('/',
      this.get.validation,
      asyncMiddleware(this.get.handler));

    return router;
  },

  /**
   * Retrieve all or the given attachment ids.
   */
  get: {
    validation: [
      query('ids'),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const { Media } = req.models;
      const media = await Media.query().onBuild((builder) => {

        if (req.query.ids) {
          const ids = Array.isArray(req.query.ids) ? req.query.ids : [req.query.ids];
          builder.whereIn('id', ids);
        }
      });

      return res.status(200).send({ media });
    },
  },

  /**
   * Uploads the given attachment file.
   */
  upload: {
    validation: [
      // check('attachment').exists(),
    ],
    async handler(req, res) {
      if (!req.files.attachment) {
        return res.status(400).send({
          errors: [{ type: 'ATTACHMENT.NOT.FOUND', code: 200 }],
        });
      }
      const publicPath = 'storage/app/public/';
      const attachmentsMimes = ['image/png', 'image/jpeg'];
      const { attachment } = req.files;
      const { Media } = req.models;

      const errorReasons = [];

      // Validate the attachment.
      if (attachment && attachmentsMimes.indexOf(attachment.mimetype) === -1) {
        errorReasons.push({ type: 'ATTACHMENT.MINETYPE.NOT.SUPPORTED', code: 160 });
      }
      // Catch all error reasons to response 400.
      if (errorReasons.length > 0) {
        return res.status(400).send({ errors: errorReasons });
      }

      try {
        await attachment.mv(`${publicPath}${req.organizationId}/${attachment.md5}.png`);
        Logger.log('info', 'Attachment uploaded successfully');
      } catch (error) {
        Logger.log('info', 'Attachment uploading failed.', { error });
      }

      const media = await Media.query().insert({
        attachment_file: `${attachment.md5}.png`,
      });
      return res.status(200).send({ media });
    },
  },

  /**
   * Deletes the given attachment ids from file system and database.
   */
  delete: {
    validation: [
      param('id').exists().isNumeric().toInt(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const { Media } = req.models;
      const { id } = req.params;
      const media = await Media.query().where('id', id).first();

      if (!media) {
        return res.status(400).send({
          errors: [{ type: 'MEDIA.ID.NOT.FOUND', code: 200 }],
        });
      }
      const publicPath = 'storage/app/public/';
      const tenantPath = `${publicPath}${req.organizationId}`;

      try {
        await fsPromises.unlink(`${tenantPath}/${media.attachmentFile}`);
        Logger.log('error', 'Attachment file has been deleted.');
      } catch (error) {
        Logger.log('error', 'Delete item attachment file delete failed.', { error });
      }
      await Media.query().where('id', media.id).delete();

      return res.status(200).send();
    },
  },
};
