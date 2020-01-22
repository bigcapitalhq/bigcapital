import express from 'express';
import { body, query, validationResult } from 'express-validator';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import Option from '@/models/Option';

export default {
  /**
   * Router constructor.
   */
  router() {
    const router = express.Router();

    router.post('/',
      this.saveOptions.validation,
      asyncMiddleware(this.saveOptions.handler));

    router.get('/',
      this.getOptions.validation,
      asyncMiddleware(this.getSettings));

    return router;
  },

  /**
   * Saves the given options to the storage.
   */
  saveOptions: {
    validation: [
      body('options').isArray(),
      body('options.*.key').exists(),
      body('options.*.value').exists(),
      body('options.*.group').exists(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'VALIDATION_ERROR', ...validationErrors,
        });
      }
      const form = { ...req.body };
      const optionsCollections = await Option.query();

      form.options.forEach((option) => {
        optionsCollections.setMeta(option.key, option.value, option.group);
      });
      await optionsCollections.saveMeta();

      return res.status(200).send();
    },
  },

  /**
   * Retrieve the application options from the storage.
   */
  getOptions: {
    validation: [
      query('key').optional(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'VALIDATION_ERROR', ...validationErrors,
        });
      }
      const options = await Option.query();

      return res.status(200).sends({
        options: options.toArray(),
      });
    },
  },
};
