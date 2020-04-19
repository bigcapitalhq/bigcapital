import express from 'express';
import { check, param, query, validationResult } from 'express-validator';
import moment from 'moment';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import jwtAuth from '@/http/middleware/jwtAuth';
import ExchangeRate from '@/models/ExchangeRate';

export default {
  /**
   * Constructor method.
   */
  router() {
    const router = express.Router();
    router.use(jwtAuth);

    router.get('/',
      this.exchangeRates.validation,
      asyncMiddleware(this.exchangeRates.handler));

    router.post('/',
      this.addExchangeRate.validation,
      asyncMiddleware(this.addExchangeRate.handler));

    router.post('/:id',
      this.editExchangeRate.validation,
      asyncMiddleware(this.editExchangeRate.handler));

    router.delete('/:id',
      this.deleteExchangeRate.validation,
      asyncMiddleware(this.deleteExchangeRate.handler));

    return router;
  },

  /**
   * Retrieve exchange rates.
   */
  exchangeRates: {
    validation: [
      query('page').optional().isNumeric().toInt(),
      query('page_size').optional().isNumeric().toInt(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const filter = {
        page: 1,
        page_size: 10,
        ...req.query,
      };
      const exchangeRates = await ExchangeRate.query()
        .pagination(filter.page - 1, filter.page_size);

      return res.status(200).send({ exchange_rates: exchangeRates });
    }
  },

  /**
   * Adds a new exchange rate on the given date.
   */
  addExchangeRate: {
    validation: [
      check('exchange_rate').exists().isNumeric().toFloat(),
      check('currency_code').exists().trim().escape(),
      check('date').exists().isISO8601(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }

      const form = { ...req.body };
      const foundExchangeRate = await ExchangeRate.query()
        .where('currency_code', form.currency_code)
        .where('date', form.date);

      if (foundExchangeRate.length > 0) {
        return res.status(400).send({
          errors: [{ type: 'EXCHANGE.RATE.DATE.PERIOD.DEFINED', code: 200 }],
        });
      }      
      await ExchangeRate.query().insert({
        ...form,
        date: moment(form.date).format('YYYY-MM-DD'),
      });

      return res.status(200).send();
    },
  },


  /**
   * Edit the given exchange rate.
   */
  editExchangeRate: {
    validation: [
      param('id').exists().isNumeric().toInt(),
      check('exchange_rate').exists().isNumeric().toFloat(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const { id } = req.params;
      const form = { ...req.body };

      const foundExchangeRate = await ExchangeRate.query()
        .where('id', id);

      if (!foundExchangeRate.length) {
        return res.status(400).send({
          errors: [{ type: 'EXCHANGE.RATE.NOT.FOUND', code: 200 }],
        });
      }
      await ExchangeRate.query()
        .where('id', id)
        .update({ ...form });

      return res.status(200).send({ id });
    },
  },

  /**
   * Delete the given exchange rate from the storage.
   */
  deleteExchangeRate: {
    validation: [
      param('id').isNumeric().toInt(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const { id } = req.params;  
      const foundExchangeRate = await ExchangeRate.query()
        .where('id', id);

      if (!foundExchangeRate.length) {
        return res.status(404).send({
          errors: [{ type: 'EXCHANGE.RATE.NOT.FOUND', code: 200 }],
        });
      }
      await ExchangeRate.query()
        .where('id', id).delete();

      return res.status(200).send({ id });
    }
  },
}