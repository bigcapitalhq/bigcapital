import express from 'express';
import { query, validationResult } from 'express-validator';
import moment from 'moment';
import JournalPoster from 'services/Accounting/JournalPoster';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import DependencyGraph from 'lib/DependencyGraph';
import { formatNumberClosure }from './FinancialStatementMixin';

export default {
  /**
   * Router constructor.
   */
  router() {
    const router = express.Router();

    router.get('/',
      this.trialBalanceSheet.validation,
      asyncMiddleware(this.trialBalanceSheet.handler));
    
    return router;
  },

  /**
   * Retrieve the trial balance sheet.
   */
  trialBalanceSheet: {
    validation: [
      query('basis').optional(),
      query('from_date').optional().isISO8601(),
      query('to_date').optional().isISO8601(),
      query('number_format.no_cents').optional().isBoolean().toBoolean(),
      query('number_format.1000_divide').optional().isBoolean().toBoolean(),
      query('account_ids').isArray().optional(),
      query('account_ids.*').isNumeric().toInt(),
      query('basis').optional(),
      query('none_zero').optional().isBoolean().toBoolean(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const { Account } = req.models;
      const filter = {
        from_date: moment().startOf('year').format('YYYY-MM-DD'),
        to_date: moment().endOf('year').format('YYYY-MM-DD'),
        number_format: {
          no_cents: false,
          divide_1000: false,
        },
        basis: 'accural',
        none_zero: false,
        account_ids: [],
        ...req.query,
      };
      if (!Array.isArray(filter.account_ids)) {
        filter.account_ids = [filter.account_ids];
      }

      const accounts = await Account.query()
        // .remember('trial_balance_accounts')
        .modify('filterAccounts', filter.account_ids)
        .withGraphFetched('type')
        .withGraphFetched('transactions')
        .modifyGraph('transactions', (builder) => {
          builder.modify('sumationCreditDebit');
          builder.modify('filterDateRange', filter.from_date, filter.to_date);
        });

      // Accounts dependency graph.
      const accountsGraph = DependencyGraph.fromArray(
        accounts, { itemId: 'id', parentItemId: 'parentAccountId' }
      );

      const journalEntriesCollect = Account.collectJournalEntries(accounts);
      const journalEntries = new JournalPoster(accountsGraph);
      journalEntries.loadEntries(journalEntriesCollect);

      // Account balance formmatter based on the given query.
      const balanceFormatter = formatNumberClosure(filter.number_format);

      const accountsResponse = accounts
        .filter((account) => (
          account.transactions.length > 0 || !filter.none_zero
        ))
        .map((account) => {
          const trial = journalEntries.getTrialBalanceWithDepands(account.id);

          return {
            id: account.id,
            parentAccountId: account.parentAccountId,
            name: account.name,
            code: account.code,
            accountNormal: account.type.normal,

            credit: trial.credit,
            debit: trial.debit,
            balance: trial.balance,

            formatted_credit: balanceFormatter(trial.credit),
            formatted_debit: balanceFormatter(trial.debit),
            formatted_balance: balanceFormatter(trial.balance),
          };
        });

      return res.status(200).send({
        query: { ...filter },
        accounts: [...Account.toNestedArray(accountsResponse) ],
      });
    },
  },
}