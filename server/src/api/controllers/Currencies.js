import express from 'express';
import { check, param, validationResult } from 'express-validator';
import asyncMiddleware from 'api/middleware/asyncMiddleware';

export default {
  /**
   * Router constructor.
   */
  router() {
    const router = express.Router();

    router.get('/',
      this.all.validation,
      asyncMiddleware(this.all.handler));

    router.post('/',
      this.newCurrency.validation,
      asyncMiddleware(this.newCurrency.handler));

    router.post('/:id',
      this.editCurrency.validation,
      asyncMiddleware(this.editCurrency.handler));

    router.delete('/:currency_code',
      this.deleteCurrecy.validation,
      asyncMiddleware(this.deleteCurrecy.handler));

    return router;
  },

  /**
   * Retrieve all registered currency details.
   */
  all: {
    validation: [],
    async handler(req, res) {
      const { Currency } = req.models;
      const currencies = await Currency.query();

      return res.status(200).send({
        currencies: [
          ...currencies,
        ],
      });
    },
  },

  newCurrency: {
    validation: [
      check('currency_name').exists().trim().escape(),
      check('currency_code').exists().trim().escape(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const form = { ...req.body };
      const { Currency } = req.models;

      const foundCurrency = await Currency.query()
        .where('currency_code', form.currency_code);

      if (foundCurrency.length > 0) {
        return res.status(400).send({
          errors: [{ type: 'CURRENCY.CODE.ALREADY.EXISTS', code: 100 }],
        });
      }
      await Currency.query()
        .insert({ ...form });

      return res.status(200).send({
        currency: { ...form },
      });
    },
  },

  deleteCurrecy: {
    validation: [
      param('currency_code').exists().trim().escape(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const { Currency } = req.models;
      const { currency_code: currencyCode } = req.params;

      await Currency.query()
        .where('currency_code', currencyCode)
        .delete();

      return res.status(200).send({ currency_code: currencyCode });
    },
  },

  editCurrency: {
    validation: [
      param('id').exists().isNumeric().toInt(),
      check('currency_name').exists().trim().escape(),
      check('currency_code').exists().trim().escape(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const form = { ...req.body };
      const { id } = req.params;
      const { Currency } = req.models;

      const foundCurrency = await Currency.query()
        .where('currency_code', form.currency_code).whereNot('id', id);

      if (foundCurrency.length > 0) {
        return res.status(400).send({
          errors: [{ type: 'CURRENCY.CODE.ALREADY.EXISTS', code: 100 }],
        });
      }
      await Currency.query().where('id', id).update({ ...form });

      return res.status(200).send({ currency: { ...form } });
    },
  },
};
