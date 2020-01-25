import express from 'express';
import { query, validationResult } from 'express-validator';
import moment from 'moment';
import { pick } from 'lodash';
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

    router.get('/ledger',
      this.ledger.validation,
      asyncMiddleware(this.ledger.handler));

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
  ledger: {
    validation: [
      query('from_date').optional().isISO8601(),
      query('to_date').optional().isISO8601(),
      query('transaction_types').optional().isArray({ min: 1 }),
      query('account_ids').optional().isArray({ min: 1 }),
      query('account_ids.*').optional().isNumeric().toInt(),
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
      const accountsJournalEntries = await AccountTransaction.query()
        .modify('filterDateRange', filter.from_date, filter.to_date)
        .modify('filterAccounts', filter.account_ids)
        .modify('filterTransactionTypes', filter.transaction_types)
        .modify('filterAmountRange', filter.from_range, filter.to_range)
        .withGraphFetched('account');

      const formatNumber = formatNumberClosure(filter.number_format);

      return res.status(200).send({
        meta: { ...filter },
        items: accountsJournalEntries.map((entry) => ({
          ...entry,
          credit: formatNumber(entry.credit),
          debit: formatNumber(entry.debit),
        })),
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
        none_zero: false,
        ...req.query,
      };
      const accounts = await Account.query()
        .orderBy('index', 'DESC')
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

      const items = [
        ...accounts
          .filter((account) => (
            account.transactions.length > 0 || !filter.none_zero
          ))
          .map((account) => ({
            ...pick(account, ['id', 'name', 'code', 'index']),
            transactions: [
              ...account.transactions.map((transaction) => ({
                ...transaction,
                credit: formatNumber(transaction.credit),
                debit: formatNumber(transaction.debit),
              })),
            ],
            opening: {
              date: filter.from_date,
              balance: opeingBalanceCollection.getClosingBalance(account.id),
            },
            closing: {
              date: filter.to_date,
              balance: closingBalanceCollection.getClosingBalance(account.id),
            },
          })),
      ];
      return res.status(200).send({
        meta: { ...filter },
        items,
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
      query('display_columns_by').optional().isIn(['year', 'month', 'week', 'day', 'quarter']),
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
        display_columns_by: 'year',
        from_date: moment().startOf('year').format('YYYY-MM-DD'),
        to_date: moment().endOf('year').format('YYYY-MM-DD'),
        number_format: {
          no_cents: false,
          divide_1000: false,
        },
        none_zero: false,
        ...req.query,
      };

      const balanceSheetTypes = await AccountType.query()
        .where('balance_sheet', true);

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

      // Gets the date range set from start to end date.
      const dateRangeSet = dateRangeCollection(
        filter.from_date,
        filter.to_date,
        filter.display_columns_by,
      );
      // Retrieve the asset balance sheet.
      const assets = [
        ...accounts
          .filter((account) => (
            account.type.normal === 'debit'
            && (account.transactions.length > 0 || !filter.none_zero)
          ))
          .map((account) => ({
            ...pick(account, ['id', 'index', 'name', 'code']),
            transactions: dateRangeSet.map((date) => {
              const type = filter.display_columns_by;
              const balance = journalEntries.getClosingBalance(account.id, date, type);
              return { date, balance: balanceFormatter(balance) };
            }),
          })),
      ];
      // Retrieve liabilities and equity balance sheet.
      const liabilitiesEquity = [
        ...accounts
          .filter((account) => (
            account.type.normal === 'credit'
            && (account.transactions.length > 0 || !filter.none_zero)
          ))
          .map((account) => ({
            ...pick(account, ['id', 'index', 'name', 'code']),
            transactions: dateRangeSet.map((date) => {
              const type = filter.display_columns_by;
              const balance = journalEntries.getClosingBalance(account.id, date, type);
              return { date, balance: balanceFormatter(balance) };
            }),
          })),
      ];
      return res.status(200).send({
        columns: { ...dateRangeSet },
        balance_sheet: {
          assets,
          liabilities_equity: liabilitiesEquity,
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
        meta: { ...filter },
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
      query('display_columns_by').optional().isIn(['year', 'month', 'week', 'day', 'quarter']),
      query('accounts').optional().isArray(),
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
        display_columns_by: 'month',
        ...req.query,
      };
      const incomeStatementTypes = await AccountType.query().where('income_sheet', true);

      const accounts = await Account.query()
        .whereIn('account_type_id', incomeStatementTypes.map((t) => t.id))
        .withGraphFetched('type')
        .withGraphFetched('transactions');

      const filteredAccounts = accounts.filter((account) => {
        return account.transactions.length > 0 || !filter.none_zero;
      });
      const journalEntriesCollected = Account.collectJournalEntries(accounts);
      const journalEntries = new JournalPoster();
      journalEntries.loadEntries(journalEntriesCollected);

      // Account balance formmatter based on the given query.
      const numberFormatter = formatNumberClosure(filter.number_format);

      // Gets the date range set from start to end date.
      const dateRangeSet = dateRangeCollection(
        filter.from_date,
        filter.to_date,
        filter.display_columns_by,
      );
      const accountsIncome = filteredAccounts
        .filter((account) => account.type.normal === 'credit')
        .map((account) => ({
          ...pick(account, ['id', 'index', 'name', 'code']),
          dates: dateRangeSet.map((date) => {
            const type = filter.display_columns_by;
            const amount = journalEntries.getClosingBalance(account.id, date, type);

            return { date, rawAmount: amount, amount: numberFormatter(amount) };
          }),
        }));

      const accountsExpenses = filteredAccounts
        .filter((account) => account.type.normal === 'debit')
        .map((account) => ({
          ...pick(account, ['id', 'index', 'name', 'code']),
          dates: dateRangeSet.map((date) => {
            const type = filter.display_columns_by;
            const amount = journalEntries.getClosingBalance(account.id, date, type);

            return { date, rawAmount: amount, amount: numberFormatter(amount) };
          }),
        }));

      // Calculates the total income of income accounts.
      const totalAccountsIncome = dateRangeSet.reduce((acc, date, index) => {
        let amount = 0;
        accountsIncome.forEach((account) => {
          const currentDate = account.dates[index];
          amount += currentDate.rawAmount || 0;
        });
        acc[date] = { date, rawAmount: amount, amount: numberFormatter(amount) };
        return acc;
      }, {});

      // Calculates the total expenses of expenses accounts.
      const totalAccountsExpenses = dateRangeSet.reduce((acc, date, index) => {
        let amount = 0;
        accountsExpenses.forEach((account) => {
          const currentDate = account.dates[index];
          amount += currentDate.rawAmount || 0;
        });
        acc[date] = { date, rawAmount: amount, amount: numberFormatter(amount) };
        return acc;
      }, {});

      // Total income(date) - Total expenses(date) = Net income(date)
      const netIncome = dateRangeSet.map((date) => {
        const totalIncome = totalAccountsIncome[date];
        const totalExpenses = totalAccountsExpenses[date];

        let amount = totalIncome.rawAmount || 0;
        amount -= totalExpenses.rawAmount || 0;
        return { date, rawAmount: amount, amount: numberFormatter(amount) };
      });

      return res.status(200).send({
        meta: { ...filter },
        income: {
          entry_normal: 'credit',
          accounts: accountsIncome,
        },
        expenses: {
          entry_normal: 'debit',
          accounts: accountsExpenses,
        },
        total_income: Object.values(totalAccountsIncome),
        total_expenses: Object.values(totalAccountsExpenses),
        total_net_income: netIncome,
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
