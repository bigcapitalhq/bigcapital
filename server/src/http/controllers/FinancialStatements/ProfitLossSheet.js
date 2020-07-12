import express from 'express';
import { query, oneOf, validationResult } from 'express-validator';
import moment from 'moment';
import { pick, sumBy } from 'lodash';
import JournalPoster from '@/services/Accounting/JournalPoster';
import { dateRangeCollection } from '@/utils';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import { formatNumberClosure } from './FinancialStatementMixin';

export default {
  /**
   * Router constructor.
   */
  router() {
    const router = express.Router();

    router.get(
      '/',
      this.profitLossSheet.validation,
      asyncMiddleware(this.profitLossSheet.handler)
    );
    return router;
  },

  /**
   * Retrieve profit/loss financial statement.
   */
  profitLossSheet: {
    validation: [
      query('basis').optional(),
      query('from_date').optional().isISO8601(),
      query('to_date').optional().isISO8601(),
      query('number_format.no_cents').optional().isBoolean(),
      query('number_format.divide_1000').optional().isBoolean(),
      query('basis').optional(),
      query('none_zero').optional().isBoolean().toBoolean(),
      query('account_ids').isArray().optional(),
      query('account_ids.*').isNumeric().toInt(),
      query('display_columns_type').optional().isIn(['total', 'date_periods']),
      query('display_columns_by')
        .optional({ nullable: true, checkFalsy: true })
        .isIn(['year', 'month', 'week', 'day', 'quarter']),
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
        from_date: moment().startOf('year').format('YYYY-MM-DD'),
        to_date: moment().endOf('year').format('YYYY-MM-DD'),
        number_format: {
          no_cents: false,
          divide_1000: false,
        },
        basis: 'accural',
        none_zero: false,
        display_columns_type: 'total',
        display_columns_by: 'month',
        account_ids: [],
        ...req.query,
      };
      if (!Array.isArray(filter.account_ids)) {
        filter.account_ids = [filter.account_ids];
      }
      const incomeStatementTypes = await AccountType.query().where(
        'income_sheet',
        true
      );
      // Fetch all income accounts from storage.
      const accounts = await Account.query()
        // .remember('profit_loss_accounts')
        .modify('filterAccounts', filter.account_ids)
        .whereIn(
          'account_type_id',
          incomeStatementTypes.map((t) => t.id)
        )
        .withGraphFetched('type')
        .withGraphFetched('transactions');

      // Accounts dependency graph.
      const accountsGraph = Account.toDependencyGraph(accounts);

      // Filter all none zero accounts if it was enabled.
      const filteredAccounts = accounts.filter(
        (account) => account.transactions.length > 0 || !filter.none_zero
      );
      const journalEntriesCollected = Account.collectJournalEntries(accounts);
      const journalEntries = new JournalPoster(accountsGraph);
      journalEntries.loadEntries(journalEntriesCollected);

      // Account balance formmatter based on the given query.
      const numberFormatter = formatNumberClosure(filter.number_format);
      const comparatorDateType =
        filter.display_columns_type === 'total'
          ? 'day'
          : filter.display_columns_by;
      // Gets the date range set from start to end date.
      const dateRangeSet = dateRangeCollection(
        filter.from_date,
        filter.to_date,
        comparatorDateType
      );
      const accountsMapper = (incomeExpenseAccounts) =>
        incomeExpenseAccounts.map((account) => ({
          ...pick(account, ['id', 'index', 'name', 'code', 'parentAccountId']),
          // Total closing balance of the account.
          ...(filter.display_columns_type === 'total' && {
            total: (() => {
              const amount = journalEntries.getAccountBalance(
                account.id,
                filter.to_date
              );
              return {
                amount,
                date: filter.to_date,
                formatted_amount: numberFormatter(amount),
              };
            })(),
          }),
          // Date periods when display columns type `periods`.
          ...(filter.display_columns_type === 'date_periods' && {
            periods: dateRangeSet.map((date) => {
              const type = comparatorDateType;
              const amount = journalEntries.getAccountBalance(
                account.id,
                date,
                type
              );
              return {
                date,
                amount,
                formatted_amount: numberFormatter(amount),
              };
            }),
          }),
        }));

      const accountsIncome = Account.toNestedArray(
        accountsMapper(
          filteredAccounts.filter((account) => account.type.normal === 'credit')
        )
      );
      const accountsExpenses = Account.toNestedArray(
        accountsMapper(
          filteredAccounts.filter((account) => account.type.normal === 'debit')
        )
      );
      const totalPeriodsMapper = (incomeExpenseAccounts) =>
        Object.values(
          dateRangeSet.reduce((acc, date, index) => {
            let amount = sumBy(
              incomeExpenseAccounts,
              `periods[${index}].amount`
            );
            acc[date] = {
              date,
              amount,
              formatted_amount: numberFormatter(amount),
            };
            return acc;
          }, {})
        );

      // Total income - Total expenses = Net income
      const netIncomePeriodsMapper = (
        totalIncomeAcocunts,
        totalExpenseAccounts
      ) =>
        dateRangeSet.map((date, index) => {
          const totalIncome = totalIncomeAcocunts[index];
          const totalExpenses = totalExpenseAccounts[index];

          let amount = totalIncome.amount || 0;
          amount -= totalExpenses.amount || 0;
          return { date, amount, formatted_amount: numberFormatter(amount) };
        });

      // @return {Object}
      const netIncomeTotal = (totalIncome, totalExpenses) => {
        const netIncomeAmount = totalIncome.amount - totalExpenses.amount;
        return {
          amount: netIncomeAmount,
          formatted_amount: netIncomeAmount,
          date: filter.to_date,
        };
      };

      const incomeResponse = {
        entry_normal: 'credit',
        accounts: accountsIncome,
        ...(filter.display_columns_type === 'total' &&
          (() => {
            const totalIncomeAccounts = sumBy(accountsIncome, 'total.amount');
            return {
              total: {
                amount: totalIncomeAccounts,
                date: filter.to_date,
                formatted_amount: numberFormatter(totalIncomeAccounts),
              },
            };
          })()),
        ...(filter.display_columns_type === 'date_periods' && {
          total_periods: [...totalPeriodsMapper(accountsIncome)],
        }),
      };
      const expenseResponse = {
        entry_normal: 'debit',
        accounts: accountsExpenses,
        ...(filter.display_columns_type === 'total' &&
          (() => {
            const totalExpensesAccounts = sumBy(
              accountsExpenses,
              'total.amount'
            );
            return {
              total: {
                amount: totalExpensesAccounts,
                date: filter.to_date,
                formatted_amount: numberFormatter(totalExpensesAccounts),
              },
            };
          })()),
        ...(filter.display_columns_type === 'date_periods' && {
          total_periods: [...totalPeriodsMapper(accountsExpenses)],
        }),
      };
      const netIncomeResponse = {
        ...(filter.display_columns_type === 'total' && {
          total: {
            ...netIncomeTotal(incomeResponse.total, expenseResponse.total),
          },
        }),
        ...(filter.display_columns_type === 'date_periods' && {
          total_periods: [
            ...netIncomePeriodsMapper(
              incomeResponse.total_periods,
              expenseResponse.total_periods
            ),
          ],
        }),
      };
      return res.status(200).send({
        query: { ...filter },
        columns: [...dateRangeSet],
        profitLoss: {
          income: incomeResponse,
          expenses: expenseResponse,
          net_income: netIncomeResponse,
        },
      });
    },
  },
};
