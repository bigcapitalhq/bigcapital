import express from 'express';
import { check, validationResult, oneOf } from 'express-validator';
import { difference } from 'lodash';
import moment from 'moment';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import jwtAuth from '@/http/middleware/jwtAuth';
import JournalPoster from '@/services/Accounting/JournalPoster';
import JournalEntry from '@/services/Accounting/JournalEntry';

export default {
  /**
   * Router constructor.
   */
  router() {
    const router = express.Router();

    router.use(jwtAuth);

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
      check('date').optional(),
      check('note').optional().trim().escape(),
      check('balance_adjustment_account').exists().isNumeric().toInt(),
      check('accounts').isArray({ min: 1 }),
      check('accounts.*.id').exists().isInt(),
      oneOf([
        check('accounts.*.debit').exists().isNumeric().toFloat(),
        check('accounts.*.credit').exists().isNumeric().toFloat(),
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
      const { user } = req;
      const form = { ...req.body };
      const date = moment(form.date).format('YYYY-MM-DD');

      const accountsIds = accounts.map((account) => account.id);

      const { Account, ManualJournal } = req.models;
      const storedAccounts = await Account.query()
        .select(['id']).whereIn('id', accountsIds)
        .withGraphFetched('type');

      const accountsCollection = new Map(storedAccounts.map((i) => [i.id, i]));

      // Get the stored accounts Ids and difference with submit accounts.
      const accountsStoredIds = storedAccounts.map((account) => account.id);
      const notFoundAccountsIds = difference(accountsIds, accountsStoredIds);
      const errorReasons = [];

      if (notFoundAccountsIds.length > 0) {
        const ids = notFoundAccountsIds.map((a) => parseInt(a, 10));
        errorReasons.push({ type: 'NOT_FOUND_ACCOUNT', code: 100, ids });
      }
      if (form.balance_adjustment_account) {
        const account = await Account.query().findById(form.balance_adjustment_account);

        if (!account) {
          errorReasons.push({ type: 'BALANCE.ADJUSTMENT.ACCOUNT.NOT.EXIST', code: 300 });
        }
      }
      if (errorReasons.length > 0) {
        return res.boom.badData(null, { errors: errorReasons });
      }

      const journalEntries = new JournalPoster();

      accounts.forEach((account) => {
        const storedAccount = accountsCollection.get(account.id);

        // Can't continue in case the stored account was not found.
        if (!storedAccount) { return; }

        const entryModel = new JournalEntry({
          referenceType: 'OpeningBalance',
          account: account.id,
          accountNormal: storedAccount.type.normal,
          userId: user.id,
        });
        if (account.credit) {
          entryModel.entry.credit = account.credit;
          journalEntries.credit(entryModel);
        } else if (account.debit) {
          entryModel.entry.debit = account.debit;
          journalEntries.debit(entryModel);
        }
      });
      // Calculates the credit and debit balance of stacked entries.
      const trial = journalEntries.getTrialBalance();

      if (trial.credit !== trial.debit) {
        const entryModel = new JournalEntry({
          referenceType: 'OpeningBalance',
          account: form.balance_adjustment_account,
          accountNormal: 'credit',
          userId: user.id,
        });

        if (trial.credit > trial.debit) {
          entryModel.entry.credit = Math.abs(trial.credit);
          journalEntries.credit(entryModel);

        } else if (trial.credit < trial.debit) {
          entryModel.entry.debit = Math.abs(trial.debit);
          journalEntries.debit(entryModel);
        }
      }
      const manualJournal = await ManualJournal.query().insert({
        amount: Math.max(trial.credit, trial.debit),
        transaction_type: 'OpeningBalance',
        date,
        note: form.note,
        user_id: user.id,
      });

      journalEntries.entries = journalEntries.entries.map((entry) => ({
        ...entry,
        referenceId: manualJournal.id,
      }));
      await Promise.all([
        journalEntries.saveEntries(),
        journalEntries.saveBalance(),
      ]);
      return res.status(200).send({ id: manualJournal.id });
    },
  },
};
