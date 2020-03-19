import { check, query, oneOf, validationResult } from 'express-validator';
import express from 'express';
import { difference } from 'lodash';
import moment from 'moment';
import Account from '@/models/Account';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import JWTAuth from '@/http/middleware/jwtAuth';
import JournalPoster from '@/services/Accounting/JournalPoster';
import JournalEntry from '@/services/Accounting/JournalEntry';
import ManualJournal from '@/models/JournalEntry';

export default {
  /**
   * Router constructor.
   */
  router() {
    const router = express.Router();
    router.use(JWTAuth);

    router.post('/make-journal-entries',
      this.makeJournalEntries.validation,
      asyncMiddleware(this.makeJournalEntries.handler));

    router.post('/recurring-journal-entries',
      this.recurringJournalEntries.validation,
      asyncMiddleware(this.recurringJournalEntries.handler));

    router.post('quick-journal-entries',
      this.quickJournalEntries.validation,
      asyncMiddleware(this.quickJournalEntries.handler));

    return router;
  },

  /**
   * Make journal entrires.
   */
  makeJournalEntries: {
    validation: [
      check('date').isISO8601(),
      check('reference').exists(),
      check('memo').optional().trim().escape(),
      check('entries').isArray({ min: 1 }),
      check('entries.*.credit').optional({ nullable: true }).isNumeric().toInt(),
      check('entries.*.debit').optional({ nullable: true }).isNumeric().toInt(),
      check('entries.*.account_id').isNumeric().toInt(),
      check('entries.*.note').optional(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const form = {
        date: new Date(),
        ...req.body,
      };

      let totalCredit = 0;
      let totalDebit = 0;

      const { user } = req;
      const errorReasons = [];
      const entries = form.entries.filter((entry) => (entry.credit || entry.debit));
      const formattedDate = moment(form.date).format('YYYY-MM-DD');

      entries.forEach((entry) => {
        if (entry.credit > 0) {
          totalCredit += entry.credit;
        }
        if (entry.debit > 0) {
          totalDebit += entry.debit;
        }
      });

      if (totalCredit <= 0 || totalDebit <= 0) {
        errorReasons.push({
          type: 'CREDIT.DEBIT.SUMATION.SHOULD.NOT.EQUAL.ZERO',
          code: 400,
        });
      }
      if (totalCredit !== totalDebit) {
        errorReasons.push({ type: 'CREDIT.DEBIT.NOT.EQUALS', code: 100 });
      }
      const accountsIds = entries.map((entry) => entry.account_id);
      const accounts = await Account.query().whereIn('id', accountsIds)
        .withGraphFetched('type');

      const storedAccountsIds = accounts.map((account) => account.id);

      if (difference(accountsIds, storedAccountsIds).length > 0) {
        errorReasons.push({ type: 'ACCOUNTS.IDS.NOT.FOUND', code: 200 });
      }

      const journalReference = await ManualJournal.query().where('reference', form.reference);

      if (journalReference.length > 0) {
        errorReasons.push({ type: 'REFERENCE.ALREADY.EXISTS', code: 300 });
      }
      if (errorReasons.length > 0) {
        return res.status(400).send({ errors: errorReasons });
      }

      // Save manual journal transaction.
      const manualJournal = await ManualJournal.query().insert({
        reference: form.reference,
        transaction_type: 'Journal',
        amount: totalCredit,
        date: formattedDate,
        note: form.memo,
        user_id: user.id,
      });
      const journalPoster = new JournalPoster();

      entries.forEach((entry) => {
        const account = accounts.find((a) => a.id === entry.account_id);

        const jouranlEntry = new JournalEntry({
          debit: entry.debit,
          credit: entry.credit,
          account: account.id,
          transactionType: 'Journal',
          accountNormal: account.type.normal,
          note: entry.note,
          date: formattedDate,
          userId: user.id,
        });
        if (entry.debit) {
          journalPoster.debit(jouranlEntry);
        } else {
          journalPoster.credit(jouranlEntry);
        }
      });

      // Saves the journal entries and accounts balance changes.
      await Promise.all([
        journalPoster.saveEntries(),
        journalPoster.saveBalance(),
      ]);
      return res.status(200).send({ id: manualJournal.id });
    },
  },

  /**
   * Saves recurring journal entries template.
   */
  recurringJournalEntries: {
    validation: [
      check('template_name').exists(),
      check('recurrence').exists(),
      check('active').optional().isBoolean().toBoolean(),
      check('entries').isArray({ min: 1 }),
      check('entries.*.credit').isNumeric().toInt(),
      check('entries.*.debit').isNumeric().toInt(),
      check('entries.*.account_id').isNumeric().toInt(),
      check('entries.*.note').optional(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }

    },
  },

  recurringJournalsList: {
    validation: [
      query('page').optional().isNumeric().toInt(),
      query('page_size').optional().isNumeric().toInt(),
      query('template_name').optional(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
    },
  },

  quickJournalEntries: {
    validation: [
      check('date').exists().isISO8601(),
      check('amount').exists().isNumeric().toFloat(),
      check('credit_account_id').exists().isNumeric().toInt(),
      check('debit_account_id').exists().isNumeric().toInt(),
      check('transaction_type').exists(),
      check('note').optional(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const errorReasons = [];
      const form = { ...req.body };

      const foundAccounts = await Account.query()
        .where('id', form.credit_account_id)
        .orWhere('id', form.debit_account_id);

      const creditAccount = foundAccounts.find((a) => a.id === form.credit_account_id);
      const debitAccount = foundAccounts.find((a) => a.id === form.debit_account_id);

      if (!creditAccount) {
        errorReasons.push({ type: 'CREDIT_ACCOUNT.NOT.EXIST', code: 100 });
      }
      if (!debitAccount) {
        errorReasons.push({ type: 'DEBIT_ACCOUNT.NOT.EXIST', code: 200 });
      }
      if (errorReasons.length > 0) {
        return res.status(400).send({ errors: errorReasons });
      }

      // const journalPoster = new JournalPoster();
      // const journalCredit = new JournalEntry({
      //   debit: 
      //   account: debitAccount.id,
      //   referenceId: 
      // })

      return res.status(200).send();
    },
  },
};
