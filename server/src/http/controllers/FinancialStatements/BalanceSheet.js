import express from 'express';
import { query, oneOf, validationResult } from 'express-validator';
import moment from 'moment';
import { pick, difference, groupBy } from 'lodash';
import JournalPoster from '@/services/Accounting/JournalPoster';
import { dateRangeCollection } from '@/utils';
import DependencyGraph from '@/lib/DependencyGraph';
import asyncMiddleware from '@/http/middleware/asyncMiddleware'
import { formatNumberClosure } from './FinancialStatementMixin';


export default {
  /**
   * Router constructor.
   */
  router() {
    const router = express.Router();

    router.get('/', 
      this.balanceSheet.validation,
      asyncMiddleware(this.balanceSheet.handler));

    return router;
  },
  
  /**
   * Retrieve the balance sheet.
   */
  balanceSheet: {
    validation: [
      query('accounting_method').optional().isIn(['cash', 'accural']),
      query('from_date').optional(),
      query('to_date').optional(),
      query('display_columns_type').optional().isIn(['date_periods', 'total']),
      query('display_columns_by').optional({ nullable: true, checkFalsy: true })
        .isIn(['year', 'month', 'week', 'day', 'quarter']),
      query('number_format.no_cents').optional().isBoolean().toBoolean(),
      query('number_format.divide_1000').optional().isBoolean().toBoolean(),
      query('account_ids').isArray().optional(),
      query('account_ids.*').isNumeric().toInt(),
      query('none_zero').optional().isBoolean().toBoolean(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const { Account, AccountType } = req.models;

      const filter = {
        display_columns_type: 'total',
        display_columns_by: '',
        from_date: moment().startOf('year').format('YYYY-MM-DD'),
        to_date: moment().endOf('year').format('YYYY-MM-DD'),
        number_format: {
          no_cents: false,
          divide_1000: false,
        },
        none_zero: false,
        basis: 'cash',
        account_ids: [],
        ...req.query,
      };
      if (!Array.isArray(filter.account_ids)) {
        filter.account_ids = [filter.account_ids];
      }
      
      // Account balance formmatter based on the given query.
      const balanceFormatter = formatNumberClosure(filter.number_format);
      const comparatorDateType = filter.display_columns_type === 'total' ? 'day' : filter.display_columns_by;

      const balanceSheetTypes = await AccountType.query().where('balance_sheet', true);

      // Fetch all balance sheet accounts from the storage.
      const accounts = await Account.query()
        // .remember('balance_sheet_accounts')
        .whereIn('account_type_id', balanceSheetTypes.map((a) => a.id))
        .modify('filterAccounts', filter.account_ids)
        .withGraphFetched('type')
        .withGraphFetched('transactions')
        .modifyGraph('transactions', (builder) => {
          builder.modify('filterDateRange', null, filter.to_date);
        });

      // Accounts dependency graph.
      const accountsGraph = DependencyGraph.fromArray(
        accounts, { itemId: 'id', parentItemId: 'parentAccountId' }
      );
      // Load all entries that associated to the given accounts.
      const journalEntriesCollected = Account.collectJournalEntries(accounts);
      const journalEntries = new JournalPoster(accountsGraph);

      journalEntries.loadEntries(journalEntriesCollected);

      // Date range collection. 
      const dateRangeSet = (filter.display_columns_type === 'date_periods')
        ? dateRangeCollection(
          filter.from_date, filter.to_date, comparatorDateType,
        ) : [];

      // Gets the date range set from start to end date.
      const totalPeriods = (account) => ({
        total_periods: dateRangeSet.map((date) => {
          const amount = journalEntries.getAccountBalance(account.id, date, comparatorDateType);

          return {
            amount,
            formatted_amount: balanceFormatter(amount),
            date,
          };
        }),
      });

      const accountsMapperToResponse = (account) => {
        // Calculates the closing balance to the given date.
        const closingBalance = journalEntries.getAccountBalance(account.id, filter.to_date);

        return {
          ...pick(account, ['id', 'index', 'name', 'code', 'parentAccountId']),

          // Date periods when display columns.
          ...(filter.display_columns_type === 'date_periods') && totalPeriods(account),

          total: {
            amount: closingBalance,
            formatted_amount: balanceFormatter(closingBalance),
            date: filter.to_date,
          },
        };
      };

      // Retrieve all assets accounts.
      const assetsAccounts = accounts.filter((account) => (
        account.type.normal === 'debit'
          && (account.transactions.length > 0 || !filter.none_zero)))
          .map(accountsMapperToResponse);

      // Retrieve all liability accounts.
      const liabilitiesAccounts = accounts.filter((account) => (
        account.type.normal === 'credit'
          && (account.transactions.length > 0 || !filter.none_zero)))
          .map(accountsMapperToResponse);

      // Retrieve the asset balance sheet.
      const assetsAccountsResponse = Account.toNestedArray(assetsAccounts);

      // Retrieve liabilities and equity balance sheet.
      const liabilitiesEquityResponse = Account.toNestedArray(liabilitiesAccounts);

      // Response.
      return res.status(200).send({
        query: { ...filter },
        columns: { ...dateRangeSet },
        accounts: [
          {
            name: 'Assets',
            type: 'assets',
            children: [...assetsAccountsResponse],
          },
          {
            name: 'Liabilities & Equity',
            type: 'liabilities_equity',
            children: [...liabilitiesEquityResponse],
          },
        ],
      });
    },
  },
}