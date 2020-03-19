import express from 'express';
import {
  check,
  param,
  query,
  validationResult,
} from 'express-validator';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';

export default {

  router() {
    const router = express.Router();

    router.post('/',
      this.newCustomer.validation,
      asyncMiddleware(this.newCustomer.handler));

    router.post('/:id',
      this.editCustomer.validation,
      asyncMiddleware(this.editCustomer.handler));

    return router;
  },

  newCustomer: {
    validation: [
      check('custom_type').exists().trim().escape(),
      check('first_name').exists().trim().escape(),
      check('last_name'),
      check('company_name'),
      check('email'),
      check('work_phone'),
      check('personal_phone'),

      check('billing_address.country'),
      check('billing_address.address'),
      check('billing_address.city'),
      check('billing_address.phone'),
      check('billing_address.zip_code'),

      check('shiping_address.country'),
      check('shiping_address.address'),
      check('shiping_address.city'),
      check('shiping_address.phone'),
      check('shiping_address.zip_code'),

      check('contact.additional_phone'),
      check('contact.additional_email'),

      check('custom_fields').optional().isArray({ min: 1 }),
      check('custom_fields.*.key').exists().trim().escape(),
      check('custom_fields.*.value').exists(),

      check('inactive').optional().isBoolean().toBoolean(),
    ],

    async handler(req, res) {

    },
  },

  editCustomer: {
    validation: [

    ],
    async handler(req, res) {

    },
  },
};
