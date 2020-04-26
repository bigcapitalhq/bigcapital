import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { pick } from 'lodash';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';

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
      asyncMiddleware(this.getOptions.handler));

    return router;
  },

  /**
   * Saves the given options to the storage.
   */
  saveOptions: {
    validation: [
      body('options').isArray({ min: 1 }),
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
      const { Option } = req.models;
      const form = { ...req.body };
      const optionsCollections = await Option.query();

      const errorReasons = [];
      const notDefinedOptions = Option.validateDefined(form.options);

      if (notDefinedOptions.length) {
        errorReasons.push({
          type: 'OPTIONS.KEY.NOT.DEFINED',
          code: 200,
          keys: notDefinedOptions.map((o) => ({ ...pick(o, ['key', 'group']) })),
        });
      }
      if (errorReasons.length) {
        return res.status(400).send({ errors: errorReasons });
      }
      form.options.forEach((option) => {
        optionsCollections.setMeta({ ...option });
      });
      await optionsCollections.saveMeta();

      return res.status(200).send({ options: form });
    },
  },

  /**
   * Retrieve the application options from the storage.
   */
  getOptions: {
    validation: [
      query('key').optional(),
      query('group').optional(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'VALIDATION_ERROR', ...validationErrors,
        });
      }
      const { Option } = req.models;
      const filter = { ...req.query };
      const options = await Option.query().onBuild((builder) => {
        if (filter.key) {
          builder.where('key', filter.key);
        }
        if (filter.group) {
          builder.where('group', filter.group);
        }
      });
      return res.status(200).send({ options: options.metadata });
    },
  },
};
