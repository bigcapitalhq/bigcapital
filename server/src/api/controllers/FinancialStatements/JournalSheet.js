import express from 'express';
import { query, oneOf, validationResult } from 'express-validator';
import moment from 'moment';
import { groupBy } from 'lodash';
import JournalPoster from 'services/Accounting/JournalPoster';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import { formatNumberClosure } from './FinancialStatementMixin';


export default {
  /**
   * Router constructor.
   */
  router() {
    const router = express.Router();

    router.get('/', 
      this.journal.validation,
      asyncMiddleware(this.journal.handler));

    return router;
  },

  /**
   * Retrieve the ledger report of the given account.
   */
  journal: {
    validation: [
      query('from_date').optional().isISO8601(),
      query('to_date').optional().isISO8601(),
      oneOf([
        query('transaction_types').optional().isArray({ min: 1 }),
        query('transaction_types.*').optional().isNumeric().toInt(),
      ], [
        query('transaction_types').optional().trim().escape(),
      ]),
      oneOf([
        query('account_ids').optional().isArray({ min: 1 }),
        query('account_ids.*').optional().isNumeric().toInt(),
      ], [
        query('account_ids').optional().isNumeric().toInt(),
      ]),
      query('from_range').optional().isNumeric().toInt(),
      query('to_range').optional().isNumeric().toInt(),
      query('number_format.no_cents').optional().isBoolean().toBoolean(),
      query('number_format.divide_1000').optional().isBoolean().toBoolean(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const { AccountTransaction } = req.models;

      const filter = {
        from_date: moment().startOf('year').format('YYYY-MM-DD'),
        to_date: moment().endOf('year').format('YYYY-MM-DD'),
        from_range: null,
        to_range: null,
        account_ids: [],
        transaction_types: [],
        number_format: {
          no_cents: false,
          divide_1000: false,
        },
        ...req.query,
      };
      if (!Array.isArray(filter.transaction_types)) {
        filter.transaction_types = [filter.transaction_types];
      }
      if (!Array.isArray(filter.account_ids)) {
        filter.account_ids = [filter.account_ids];
      }
      filter.account_ids = filter.account_ids.map((id) => parseInt(id, 10));

      const accountsJournalEntries = await AccountTransaction.query()
        // .remember()
        .modify('filterDateRange', filter.from_date, filter.to_date)
        .modify('filterAccounts', filter.account_ids)
        .modify('filterTransactionTypes', filter.transaction_types)
        .modify('filterAmountRange', filter.from_range, filter.to_range)
        .withGraphFetched('account.type');

      const formatNumber = formatNumberClosure(filter.number_format);

      const journalGrouped = groupBy(accountsJournalEntries,
        (entry) => `${entry.referenceId}-${entry.referenceType}`);

      const journal = Object.keys(journalGrouped).map((key) => {
        const transactionsGroup = journalGrouped[key];

        const journalPoster = new JournalPoster();
        journalPoster.loadEntries(transactionsGroup);

        const trialBalance = journalPoster.getTrialBalance();

        return {
          id: key,
          entries: transactionsGroup,

          credit: trialBalance.credit,
          debit: trialBalance.debit,

          formatted_credit: formatNumber(trialBalance.credit),
          formatted_debit: formatNumber(trialBalance.debit),
        };
      });

      return res.status(200).send({
        query: { ...filter },
        journal,
      });
    },
  },

  
}