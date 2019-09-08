import express from 'express';
import { check, validationResult, oneOf } from 'express-validator';
import { difference } from 'lodash';
import asyncMiddleware from '../middleware/asyncMiddleware';
import Account from '@/models/Account';
// import AccountBalance from '@/models/AccountBalance';

export default {

  router() {
    const router = express.Router();

    router.post('/',
      this.openingBalnace.validation,
      asyncMiddleware(this.openingBalnace.handler));

    return router;
  },

  openingBalnace: {
    validation: [
      check('accounts').isArray({ min: 1 }),
      check('accounts.*.id').exists().isInt(),
      oneOf([
        check('accounts.*.debit').isNumeric().toFloat(),
        check('accounts.*.credit').isNumeric().toFloat(),
      ]),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }

      const { accounts } = req.body;

      const accountsIds = accounts.map((account) => account.id);
      const accountsCollection = await Account.query((query) => {
        query.select(['id']);
        query.whereIn('id', accountsIds);
      }).fetchAll();

      const accountsStoredIds = accountsCollection.map((account) => account.attributes.id);
      const notFoundAccountsIds = difference(accountsIds, accountsStoredIds);

      const errorReasons = [];

      if (notFoundAccountsIds.length > 0) {
        const ids = notFoundAccountsIds.map((a) => parseInt(a, 10));
        errorReasons.push({ type: 'NOT_FOUND_ACCOUNT', code: 100, ids });
      }

      if (errorReasons.length > 0) {
        return res.boom.badData(null, { errors: errorReasons });
      }

      return res.status(200).send();
    },
  },
};
