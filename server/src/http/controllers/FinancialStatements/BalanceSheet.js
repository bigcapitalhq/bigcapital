import express from 'express';
import { query, validationResult } from 'express-validator';
import moment from 'moment';
import { pick, omit, sumBy } from 'lodash';
import JournalPoster from '@/services/Accounting/JournalPoster';
import { dateRangeCollection, itemsStartWith, getTotalDeep } from '@/utils';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import { formatNumberClosure } from './FinancialStatementMixin';
import BalanceSheetStructure from '@/data/BalanceSheetStructure'; 

export default {
  /**
   * Router constructor.
   */
  router() {
    const router = express.Router();

    router.get(
      '/',
      this.balanceSheet.validation,
      asyncMiddleware(this.balanceSheet.handler)
    );

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
      query('display_columns_by')
        .optional({ nullable: true, checkFalsy: true })
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
          code: 'validation_error',
          ...validationErrors,
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
      const amountFormatter = formatNumberClosure(filter.number_format);
      const comparatorDateType =
        filter.display_columns_type === 'total'
          ? 'day'
          : filter.display_columns_by;

      const balanceSheetTypes = await AccountType.query().where(
        'balance_sheet',
        true
      );
      // Fetch all balance sheet accounts from the storage.
      const accounts = await Account.query()
        .whereIn(
          'account_type_id',
          balanceSheetTypes.map((a) => a.id)
        )
        .modify('filterAccounts', filter.account_ids)
        .withGraphFetched('type')
        .withGraphFetched('transactions')
        .modifyGraph('transactions', (builder) => {
          builder.modify('filterDateRange', null, filter.to_date);
        });
      // Accounts dependency graph.
      const accountsGraph = Account.toDependencyGraph(accounts);
      // Load all entries that associated to the given accounts.
      const journalEntriesCollected = Account.collectJournalEntries(accounts);
      const journalEntries = new JournalPoster(accountsGraph);
      journalEntries.loadEntries(journalEntriesCollected);

      // Date range collection.
      const dateRangeSet =
        filter.display_columns_type === 'date_periods'
          ? dateRangeCollection(
              filter.from_date,
              filter.to_date,
              comparatorDateType
            )
          : [];
      // Gets the date range set from start to end date.
      const getAccountTotalPeriods = (account) => ({
        total_periods: dateRangeSet.map((date) => {
          const amount = journalEntries.getAccountBalance(
            account.id,
            date,
            comparatorDateType
          );
          return {
            amount,
            date,
            formatted_amount: amountFormatter(amount),
          };
        }),
      });
      // Retrieve accounts total periods.
      const getAccountsTotalPeriods = (_accounts) =>
        Object.values(
          dateRangeSet.reduce((acc, date, index) => {
            const amount = sumBy(_accounts, `total_periods[${index}].amount`);
            acc[date] = {
              date,
              amount,
              formatted_amount: amountFormatter(amount),
            };
            return acc;
          }, {})
        );
      // Retrieve account total and total periods with account meta.
      const getAccountTotal = (account) => {
        const closingBalance = journalEntries.getAccountBalance(
          account.id,
          filter.to_date
        );
        const totalPeriods =
          (filter.display_columns_type === 'date_periods' &&
            getAccountTotalPeriods(account)) ||
          null;

        return {
          ...pick(account, ['id', 'index', 'name', 'code', 'parentAccountId']),
          ...(totalPeriods && { totalPeriods }),
          total: {
            amount: closingBalance,
            formatted_amount: amountFormatter(closingBalance),
            date: filter.to_date,
          },
        };
      };
      // Get accounts total of the given structure section
      const getAccountsSectionTotal = (_accounts) => {
        const total = getTotalDeep(_accounts, 'children', 'total.amount');
        return {
          total: {
            total,
            formatted_amount: amountFormatter(total),
          },
        };
      };
      // Strcuture accounts related mapper.
      const structureAccountsRelatedMapper = (accountsTypes) => {
        const filteredAccounts = accounts
          // Filter accounts that have no transaction when `none_zero` is on.
          .filter(
            (account) => account.transactions.length > 0 || !filter.none_zero
          )
          // Filter accounts that associated to the section accounts types.
          .filter(
            (account) => accountsTypes.indexOf(account.type.childType) !== -1
          )
          .map(getAccountTotal);
        // Gets total amount of the given accounts.
        const totalAmount = sumBy(filteredAccounts, 'total.amount');

        return {
          children: Account.toNestedArray(filteredAccounts),
          total: {
            amount: totalAmount,
            formatted_amount: amountFormatter(totalAmount),
          },
          ...(filter.display_columns_type === 'date_periods'
            ? {
                total_periods: getAccountsTotalPeriods(filteredAccounts),
              }
            : {}),
        };
      };
      // Structure section mapper.
      const structureSectionMapper = (structure) => {
        const result = {
          ...omit(structure, itemsStartWith(Object.keys(structure), '_')),
          ...(structure.children
            ? {
                children: balanceSheetWalker(structure.children),
              }
            : {}),
          ...(structure._accounts_types_related
            ? {
                ...structureAccountsRelatedMapper(
                  structure._accounts_types_related
                ),
              }
            : {}),
        };
        return {
          ...result,
          ...(!structure._accounts_types_related
            ? getAccountsSectionTotal(result.children)
            : {}),
        };
      };
      const balanceSheetWalker = (reportStructure) =>
        reportStructure.map(structureSectionMapper).filter(
          // Filter the structure sections that have no children.
          (structure) => structure.children.length > 0 || structure._forceShow
        );

      // Response.
      return res.status(200).send({
        query: { ...filter },
        columns: { ...dateRangeSet },
        balance_sheet: [...balanceSheetWalker(BalanceSheetStructure)],
      });
    },
  },
};
