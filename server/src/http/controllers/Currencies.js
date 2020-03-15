import express from 'express';
import { check, validationResult } from 'express-validator';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';

export default {

  router() {
    const router = express.Router();

    router.get('/all',
      this.all.validation,
      asyncMiddleware(this.all.handler));

    router.get('/registered',
      this.registered.validation,
      asyncMiddleware(this.registered.handler));

    return router;
  },

  all: {
    validation: [],
    async handler(req, res) {

      return res.status(200).send({
        currencies: [
          { currency_code: 'USD', currency_sign: '$' },
          { currency_code: 'LYD', currency_sign: '' },
        ],
      });
    },
  },

  registered: {
    validation: [],
    async handler(req, res) {

      return res.status(200).send({
        currencies: [
          { currency_code: 'USD', currency_sign: '$' },
          { currency_code: 'LYD', currency_sign: '' },
        ],
      });
    },
  },
};