import express from 'express';
import { query, oneOf, validationResult } from 'express-validator';
import moment from 'moment';
import { pick, difference, groupBy } from 'lodash';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import AccountTransaction from '@/models/AccountTransaction';
import jwtAuth from '@/http/middleware/jwtAuth';
import AccountType from '@/models/AccountType';
import Account from '@/models/Account';
import JournalPoster from '@/services/Accounting/JournalPoster';
import { dateRangeCollection } from '@/utils';

const formatNumberClosure = (filter) => (balance) => {
  let formattedBalance = parseFloat(balance);

  if (filter.no_cents) {
    formattedBalance = parseInt(formattedBalance, 10);
  }
  if (filter.divide_1000) {
    formattedBalance /= 1000;
  }
  return formattedBalance;
};

export default {
  /**
   * Router constructor.
   */
  router() {
    const router = express.Router();
    router.use(jwtAuth);

    router.get('/journal',
      this.journal.validation,
      asyncMiddleware(this.journal.handler));

    router.get('/general_ledger',
      this.generalLedger.validation,
      asyncMiddleware(this.generalLedger.handler));

    router.get('/balance_sheet',
      this.balanceSheet.validation,
      asyncMiddleware(this.balanceSheet.handler));

    router.get('/trial_balance_sheet',
      this.trialBalanceSheet.validation,
      asyncMiddleware(this.trialBalanceSheet.handler));

    router.get('/profit_loss_sheet',
      this.profitLossSheet.validation,
      asyncMiddleware(this.profitLossSheet.handler));

    router.get('/cash_flow_statement',
      this.cashFlowStatement.validation,
      asyncMiddleware(this.cashFlowStatement.handler));

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
        .modify('filterDateRange', filter.from_date, filter.to_date)
        .modify('filterAccounts', filter.account_ids)
        .modify('filterTransactionTypes', filter.transaction_types)
        .modify('filterAmountRange', filter.from_range, filter.to_range)
        .withGraphFetched('account.type');

      const formatNumber = formatNumberClosure(filter.number_format);

      const journalGrouped = groupBy(accountsJournalEntries, (entry) => {
        return `${entry.id}-${entry.referenceType}`;
      });
      const journal = Object.keys(journalGrouped).map((key) => {
        const transactionsGroup = journalGrouped[key];

        const journalPoster = new JournalPoster();
        journalPoster.loadEntries(transactionsGroup);

        const trialBalance = journalPoster.getTrialBalance();

        return {
          id: key,
          entries: transactionsGroup,
          credit: formatNumber(trialBalance.credit),
          debit: formatNumber(trialBalance.debit),
        };
      });

      return res.status(200).send({
        query: { ...filter },
        journal,
      });
    },
  },

  /**
   * Retrieve the general ledger financial statement.
   */
  generalLedger: {
    validation: [
      query('from_date').optional().isISO8601(),
      query('to_date').optional().isISO8601(),
      query('basis').optional(),
      query('number_format.no_cents').optional().isBoolean().toBoolean(),
      query('number_format.divide_1000').optional().isBoolean().toBoolean(),
      query('none_zero').optional().isBoolean().toBoolean(),
      query('accounts_ids').optional(),
      query('accounts_ids.*').isNumeric().toInt(),
      query('orderBy').optional().isIn(['created_at', 'name', 'code']),
      query('order').optional().isIn(['desc', 'asc']),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const filter = {
        from_date: moment().startOf('year').format('YYYY-MM-DD'),
        to_date: moment().endOf('year').format('YYYY-MM-DD'),
        basis: 'cash',
        number_format: {
          no_cents: false,
          divide_1000: false,
        },
        none_zero: false,
        accounts_ids: [],
        ...req.query,
      };
      if (!Array.isArray(filter.accounts_ids)) {
        filter.accounts_ids = [filter.accounts_ids];
      }
      filter.accounts_ids = filter.accounts_ids.map((id) => parseInt(id, 10));

      const errorReasons = [];

      if (filter.accounts_ids.length > 0) {
        const accounts = await Account.query().whereIn('id', filter.accounts_ids);
        const accountsIds = accounts.map((a) => a.id);

        if (difference(filter.accounts_ids, accountsIds).length > 0) {
          errorReasons.push({ type: 'FILTER.ACCOUNTS.IDS.NOT.FOUND', code: 200 });
        }
      }
      if (errorReasons.length > 0) {
        return res.status(400).send({ error: errorReasons });
      }
      const accounts = await Account.query()
        .orderBy('index', 'DESC')
        .modify('filterAccounts', filter.accounts_ids)
        .withGraphFetched('type')
        .withGraphFetched('transactions')
        .modifyGraph('transactions', (builder) => {
          builder.modify('filterDateRange', filter.from_date, filter.to_date);
        });

      const openingBalanceTransactions = await AccountTransaction.query()
        .modify('filterDateRange', null, filter.from_date)
        .modify('sumationCreditDebit')
        .withGraphFetched('account.type');

      const closingBalanceTransactions = await AccountTransaction.query()
        .modify('filterDateRange', null, filter.to_date)
        .modify('sumationCreditDebit')
        .withGraphFetched('account.type');

      const opeingBalanceCollection = new JournalPoster();
      const closingBalanceCollection = new JournalPoster();

      opeingBalanceCollection.loadEntries(openingBalanceTransactions);
      closingBalanceCollection.loadEntries(closingBalanceTransactions);

      // Transaction amount formatter based on the given query.
      const formatNumber = formatNumberClosure(filter.number_format);

      const items = accounts
        .filter((account) => (
          account.transactions.length > 0 || filter.none_zero
        ))
        .map((account) => ({
          ...pick(account, ['id', 'name', 'code', 'index']),
          transactions: [
            ...account.transactions.map((transaction) => {
              let amount = 0;

              if (account.type.normal === 'credit') {
                amount += transaction.credit - transaction.debit;
              } else if (account.type.normal === 'debit') {
                amount += transaction.debit - transaction.credit;
              }
              return {
                ...pick(transaction, ['id', 'note', 'transactionType', 'referenceType',
                  'referenceId', 'date', 'createdAt']),
                amount: formatNumber(amount),
              };
            }),
          ],
          opening: {
            date: filter.from_date,
            balance: opeingBalanceCollection.getClosingBalance(account.id),
          },
          closing: {
            date: filter.to_date,
            balance: closingBalanceCollection.getClosingBalance(account.id),
          },
        }));

      return res.status(200).send({
        query: { ...filter },
        accounts: items,
      });
    },
  },

  /**
   * Retrieve the balance sheet.
   */
  balanceSheet: {
    validation: [
      query('accounting_method').optional().isIn(['cash', 'accural']),
      query('from_date').optional(),
      query('to_date').optional(),
      query('display_columns_by').optional().isIn(['total', 'year', 'month', 'week', 'day', 'quarter']),
      query('number_format.no_cents').optional().isBoolean().toBoolean(),
      query('number_format.divide_1000').optional().isBoolean().toBoolean(),
      query('none_zero').optional().isBoolean().toBoolean(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const filter = {
        display_columns_by: 'total',
        from_date: moment().startOf('year').format('YYYY-MM-DD'),
        to_date: moment().endOf('year').format('YYYY-MM-DD'),
        number_format: {
          no_cents: false,
          divide_1000: false,
        },
        none_zero: false,
        basis: 'cash',
        ...req.query,
      };

      const balanceSheetTypes = await AccountType.query().where('balance_sheet', true);

      // Fetch all balance sheet accounts.
      const accounts = await Account.query()
        .whereIn('account_type_id', balanceSheetTypes.map((a) => a.id))
        .withGraphFetched('type')
        .withGraphFetched('transactions')
        .modifyGraph('transactions', (builder) => {
          builder.modify('filterDateRange', null, filter.to_date);
        });

      const journalEntriesCollected = Account.collectJournalEntries(accounts);
      const journalEntries = new JournalPoster();
      journalEntries.loadEntries(journalEntriesCollected);

      // Account balance formmatter based on the given query.
      const balanceFormatter = formatNumberClosure(filter.number_format);
      const filterDateType = filter.display_columns_by === 'total'
        ? 'day' : filter.display_columns_by;

      // Gets the date range set from start to end date.
      const dateRangeSet = dateRangeCollection(
        filter.from_date,
        filter.to_date,
        filterDateType,
      );
      // Retrieve the asset balance sheet.
      const assets = accounts
        .filter((account) => (
          account.type.normal === 'debit'
            && (account.transactions.length > 0 || !filter.none_zero)
        ))
        .map((account) => {
          // Calculates the closing balance to the given date.
          const closingBalance = journalEntries.getClosingBalance(account.id, filter.to_date);
          const type = filter.display_columns_by;

          return {
            ...pick(account, ['id', 'index', 'name', 'code']),
            ...(type !== 'total') ? {
              periods_balance: dateRangeSet.map((date) => {
                const balance = journalEntries.getClosingBalance(account.id, date, filterDateType);

                return {
                  date,
                  formatted_amount: balanceFormatter(balance),
                  amount: balance,
                };
              }),
            } : {},
            balance: {
              formatted_amount: balanceFormatter(closingBalance),
              amount: closingBalance,
              date: filter.to_date,
            },
          };
        });

      // Retrieve liabilities and equity balance sheet.
      const liabilitiesEquity = accounts
        .filter((account) => (
          account.type.normal === 'credit'
            && (account.transactions.length > 0 || !filter.none_zero)
        ))
        .map((account) => {
          // Calculates the closing balance to the given date.
          const closingBalance = journalEntries.getClosingBalance(account.id, filter.to_date);
          const type = filter.display_columns_by;

          return {
            ...pick(account, ['id', 'index', 'name', 'code']),
            ...(type !== 'total') ? {
              periods_balance: dateRangeSet.map((date) => {
                const balance = journalEntries.getClosingBalance(account.id, date, filterDateType);
                return {
                  date,
                  formatted_amount: balanceFormatter(balance),
                  amount: balance,
                };
              }),
            } : {},
            balance: {
              formatted_amount: balanceFormatter(closingBalance),
              amount: closingBalance,
              date: filter.to_date,
            },
          };
        });

      return res.status(200).send({
        query: { ...filter },
        columns: { ...dateRangeSet },
        balance_sheet: {
          assets: {
            title: 'Assets',
            accounts: [...assets],
          },
          liabilities_equity: {
            title: 'Liabilities & Equity',
            accounts: [...liabilitiesEquity],
          },
        },
      });
    },
  },

  /**
   * Retrieve the trial balance sheet.
   */
  trialBalanceSheet: {
    validation: [
      query('basis').optional(),
      query('from_date').optional().isISO8601(),
      query('to_date').optional().isISO8601(),
      query('number_format.no_cents').optional().isBoolean(),
      query('number_format.1000_divide').optional().isBoolean(),
      query('basis').optional(),
      query('none_zero').optional(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const filter = {
        from_date: moment().startOf('year').format('YYYY-MM-DD'),
        to_date: moment().endOf('year').format('YYYY-MM-DD'),
        number_format: {
          no_cents: false,
          divide_1000: false,
        },
        basis: 'accural',
        none_zero: false,
        ...req.query,
      };

      const accounts = await Account.query()
        .withGraphFetched('type')
        .withGraphFetched('transactions')
        .modifyGraph('transactions', (builder) => {
          builder.modify('sumationCreditDebit');
          builder.modify('filterDateRange', filter.from_date, filter.to_date);
        });

      const journalEntriesCollect = Account.collectJournalEntries(accounts);
      const journalEntries = new JournalPoster();
      journalEntries.loadEntries(journalEntriesCollect);

      // Account balance formmatter based on the given query.
      const balanceFormatter = formatNumberClosure(filter.number_format);

      const items = accounts
        .filter((account) => (
          account.transactions.length > 0 || !filter.none_zero
        ))
        .map((account) => {
          const trial = journalEntries.getTrialBalance(account.id);
          return {
            account_id: account.id,
            code: account.code,
            accountNormal: account.type.normal,
            credit: balanceFormatter(trial.credit),
            debit: balanceFormatter(trial.debit),
            balance: balanceFormatter(trial.balance),
          };
        });
      return res.status(200).send({
        query: { ...filter },
        items: [...items],
      });
    },
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
      query('none_zero').optional(),
      query('display_columns_type').optional().isIn([
        'total', 'date_periods',
      ]),
      query('display_columns_by').optional().isIn([
        'year', 'month', 'week', 'day', 'quarter',
      ]),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
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
        ...req.query,
      };
      const incomeStatementTypes = await AccountType.query().where('income_sheet', true);

      // Fetch all income accounts from storage.
      const accounts = await Account.query()
        .whereIn('account_type_id', incomeStatementTypes.map((t) => t.id))
        .withGraphFetched('type')
        .withGraphFetched('transactions');

      // Filter all none zero accounts if it was enabled.
      const filteredAccounts = accounts.filter((account) => (
        account.transactions.length > 0 || !filter.none_zero
      ));
      const journalEntriesCollected = Account.collectJournalEntries(accounts);
      const journalEntries = new JournalPoster();
      journalEntries.loadEntries(journalEntriesCollected);

      // Account balance formmatter based on the given query.
      const numberFormatter = formatNumberClosure(filter.number_format);
      const comparatorDateType = filter.display_columns_type === 'total'
        ? 'day' : filter.display_columns_by;

      // Gets the date range set from start to end date.
      const dateRangeSet = dateRangeCollection(
        filter.from_date,
        filter.to_date,
        comparatorDateType,
      );

      const accountsMapper = (incomeExpenseAccounts) => (
        incomeExpenseAccounts.map((account) => ({
          ...pick(account, ['id', 'index', 'name', 'code']),

          // Total closing balance of the account.
          ...(filter.display_columns_type === 'total') && {
            total: (() => {
              const amount = journalEntries.getClosingBalance(account.id, filter.to_date);
              return { amount, date: filter.to_date, formatted_amount: numberFormatter(amount) };
            })(),
          },
          // Date periods when display columns type `periods`.
          ...(filter.display_columns_type === 'date_periods') && {
            periods: dateRangeSet.map((date) => {
              const type = comparatorDateType;
              const amount = journalEntries.getClosingBalance(account.id, date, type);

              return { date, amount, formatted_amount: numberFormatter(amount) };
            }),
          },
        })));

      const totalAccountsReducer = (incomeExpenseAccounts) => (
        incomeExpenseAccounts.reduce((acc, account) => {
          const amount = (account) ? account.total.amount : 0;
          return amount + acc;
        }, 0));

      const accountsIncome = accountsMapper(filteredAccounts
        .filter((account) => account.type.normal === 'credit'));

      const accountsExpenses = accountsMapper(filteredAccounts
        .filter((account) => account.type.normal === 'debit'));

      // @return {Array}
      const totalPeriodsMapper = (incomeExpenseAccounts) => (
        Object.values(dateRangeSet.reduce((acc, date, index) => {
          let amount = 0;

          incomeExpenseAccounts.forEach((account) => {
            const currentDate = account.periods[index];
            amount += currentDate.amount || 0;
          });
          acc[date] = { date, amount, formatted_amount: numberFormatter(amount) };
          return acc;
        }, {})));

      // Total income(date) - Total expenses(date) = Net income(date)
      // @return {Array}
      const netIncomePeriodsMapper = (totalIncomeAcocunts, totalExpenseAccounts) => (
        dateRangeSet.map((date, index) => {
          const totalIncome = totalIncomeAcocunts[index];
          const totalExpenses = totalExpenseAccounts[index];

          let amount = totalIncome.amount || 0;
          amount -= totalExpenses.amount || 0;
          return { date, amount, formatted_amount: numberFormatter(amount) };
        }));

      // @return {Object}
      const netIncomeTotal = (totalIncome, totalExpenses) => {
        const netIncomeAmount = totalIncome.amount - totalExpenses.amount;
        return { amount: netIncomeAmount, formatted_amount: netIncomeAmount, date: filter.to_date };
      };

      const incomeResponse = {
        entry_normal: 'credit',
        accounts: accountsIncome,
        ...(filter.display_columns_type === 'total') && (() => {
          const totalIncomeAccounts = totalAccountsReducer(accountsIncome);
          return {
            total: {
              amount: totalIncomeAccounts,
              date: filter.to_date,
              formatted_amount: numberFormatter(totalIncomeAccounts),
            },
          };
        })(),
        ...(filter.display_columns_type === 'date_periods') && {
          total_periods: [
            ...totalPeriodsMapper(accountsIncome),
          ],
        },
      };
      const expenseResponse = {
        entry_normal: 'debit',
        accounts: accountsExpenses,
        ...(filter.display_columns_type === 'total') && (() => {
          const totalExpensesAccounts = totalAccountsReducer(accountsExpenses);
          return {
            total: {
              amount: totalExpensesAccounts,
              date: filter.to_date,
              formatted_amount: numberFormatter(totalExpensesAccounts),
            },
          };
        })(),
        ...(filter.display_columns_type === 'date_periods') && {
          total_periods: [
            ...totalPeriodsMapper(accountsExpenses),
          ],
        },
      };
      const netIncomeResponse = {
        ...(filter.display_columns_type === 'total') && {
          total: {
            ...netIncomeTotal(incomeResponse.total, expenseResponse.total),
          },
        },
        ...(filter.display_columns_type === 'date_periods') && {
          total_periods: [
            ...netIncomePeriodsMapper(
              incomeResponse.total_periods,
              expenseResponse.total_periods,
            ),
          ],
        },
      };
      return res.status(200).send({
        query: { ...filter },
        columns: [...dateRangeSet],
        income: incomeResponse,
        expenses: expenseResponse,
        net_income: netIncomeResponse,
      });
    },
  },

  cashFlowStatement: {
    validation: [
      query('date_from').optional(),
      query('date_to').optional(),
    ],
    async handler(req, res) {
      
      return res.status(200).send({
        meta: {},
        operating: [],
        financing: [],
        investing: [],
      });
    },
  },
}
