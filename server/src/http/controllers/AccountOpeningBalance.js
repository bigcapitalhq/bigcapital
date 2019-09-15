import express from 'express';
import { check, validationResult, oneOf } from 'express-validator';
import { difference } from 'lodash';
import knex from 'knex';
import asyncMiddleware from '../middleware/asyncMiddleware';
import Account from '@/models/Account';
import '@/models/AccountBalance';

export default {
  /**
   * Router constructor.
   */
  router() {
    const router = express.Router();

    router.post('/',
      this.openingBalnace.validation,
      asyncMiddleware(this.openingBalnace.handler));

    return router;
  },

  /**
   * Opening balance to the given account.
   * @param {Request} req -
   * @param {Response} res -
   */
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
      // const defaultCurrency = 'USD';

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
      }).fetchAll({
        withRelated: ['balances'],
      });

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

      const storedAccountsBalances = accountsCollection.related('balances');

      const submitBalancesMap = new Map(accounts.map((account) => [account, account.id]));
      const storedBalancesMap = new Map(storedAccountsBalances.map((balance) => [
        balance.attributes, balance.attributes.id,
      ]));

      // const updatedStoredBalanced = [];
      const notStoredBalances = [];

      accountsIds.forEach((id) => {
        if (!storedBalancesMap.get(id)) {
          notStoredBalances.push(id);
        }
      });

      await knex('accounts_balances').insert([
        ...notStoredBalances.map((id) => {
          const account = submitBalancesMap.get(id);
          return { ...account };
        }),
      ]);

      return res.status(200).send();
    },
  },
};
