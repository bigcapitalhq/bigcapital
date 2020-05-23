import express from 'express';
import { query, validationResult } from 'express-validator';
import moment from 'moment';
import { pick, difference } from 'lodash';
import JournalPoster from '@/services/Accounting/JournalPoster';
import { formatNumberClosure } from './FinancialStatementMixin';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import DependencyGraph from '@/lib/DependencyGraph';

export default {
  /**
   * Router constructor.
   */
  router() {
    const router = express.Router();

    router.get('/', 
      this.generalLedger.validation,
      asyncMiddleware(this.generalLedger.handler));

    return router;
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
      const { AccountTransaction, Account } = req.models;

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
        // .remember('general_ledger_accounts')
        .orderBy('index', 'DESC')
        .modify('filterAccounts', filter.accounts_ids)
        .withGraphFetched('type')
        .withGraphFetched('transactions')
        .modifyGraph('transactions', (builder) => {
          builder.modify('filterDateRange', filter.from_date, filter.to_date);
        });

      // Accounts dependency graph.
      const accountsGraph = DependencyGraph.fromArray(
        accounts, { itemId: 'id', parentItemId: 'parentAccountId' }
      );
 
      const openingBalanceTransactions = await AccountTransaction.query()
        // .remember()
        .modify('filterDateRange', null, filter.from_date)
        .modify('sumationCreditDebit')
        .withGraphFetched('account.type');

      const closingBalanceTransactions = await AccountTransaction.query()
        // .remember()
        .modify('filterDateRange', null, filter.to_date)
        .modify('sumationCreditDebit')
        .withGraphFetched('account.type');

      const opeingBalanceCollection = new JournalPoster(accountsGraph);
      const closingBalanceCollection = new JournalPoster(accountsGraph);

      opeingBalanceCollection.loadEntries(openingBalanceTransactions);
      closingBalanceCollection.loadEntries(closingBalanceTransactions);

      // Transaction amount formatter based on the given query.
      const formatNumber = formatNumberClosure(filter.number_format);

      const accountsResponse = accounts
        .filter((account) => (
          account.transactions.length > 0 || !filter.none_zero
        ))
        .map((account) => ({
          ...pick(account, ['id', 'name', 'code', 'index', 'parentAccountId']),
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
                amount,
                formatted_amount: formatNumber(amount),
              };
            }),
          ],
          opening: (() => {
            const openingAmount = opeingBalanceCollection.getAccountBalance(account.id);

            return {
              date: filter.from_date,
              amount: openingAmount,
              formatted_amount: formatNumber(openingAmount),
            }
          })(),
          closing: (() => {
            const closingAmount = closingBalanceCollection.getAccountBalance(account.id);

            return {
              date: filter.to_date,
              amount: closingAmount,
              formatted_amount: formatNumber(closingAmount),
            }
          })(),
        }));

      return res.status(200).send({
        query: { ...filter },
        accounts: Account.toNestedArray(accountsResponse),
      });
    },
  },
}