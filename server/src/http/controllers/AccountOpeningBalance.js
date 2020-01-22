import express from 'express';
import { check, validationResult, oneOf } from 'express-validator';
import { difference } from 'lodash';
import asyncMiddleware from '../middleware/asyncMiddleware';
import Account from '@/models/Account';
import JournalPoster from '@/services/Accounting/JournalPoster';
import JournalEntry from '@/services/Accounting/JournalEntry';

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

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }

      const { accounts } = req.body;
      const accountsIds = accounts.map((account) => account.id);
      const accountsCollection = await Account.query()
        .select(['id'])
        .whereIn('id', accountsIds);

      // Get the stored accounts Ids and difference with submit accounts.
      const accountsStoredIds = accountsCollection.map((account) => account.id);
      const notFoundAccountsIds = difference(accountsIds, accountsStoredIds);
      const errorReasons = [];

      if (notFoundAccountsIds.length > 0) {
        const ids = notFoundAccountsIds.map((a) => parseInt(a, 10));
        errorReasons.push({ type: 'NOT_FOUND_ACCOUNT', code: 100, ids });
      }
      if (errorReasons.length > 0) {
        return res.boom.badData(null, { errors: errorReasons });
      }

      const sharedJournalDetails = new JournalEntry({
        referenceType: 'OpeningBalance',
        referenceId: 1,
      });
      const journalEntries = new JournalPoster(sharedJournalDetails);

      accounts.forEach((account) => {
        const entry = new JournalEntry({
          account: account.id,
          accountNormal: account.type.normal,
        });

        if (account.credit) {
          entry.credit = account.credit;
          journalEntries.credit(entry);
        } else if (account.debit) {
          entry.debit = account.debit;
          journalEntries.debit(entry);
        }
      });

      await Promise.all([
        journalEntries.saveEntries(),
        journalEntries.saveBalance(),
      ]);
      return res.status(200).send();
    },
  },
};
