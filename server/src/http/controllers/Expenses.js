import express from 'express';
import {
  check,
  param,
  query,
  validationResult,
} from 'express-validator';
import moment from 'moment';
import { difference, chain } from 'lodash';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import Expense from '@/models/Expense';
import Account from '@/models/Account';
import JournalPoster from '@/services/Accounting/JournalPoster';
import JournalEntry from '@/services/Accounting/JournalEntry';
import JWTAuth from '@/http/middleware/jwtAuth';
import AccountTransaction from '@/models/AccountTransaction';
import View from '@/models/View';
import Resource from '../../models/Resource';

export default {
  /**
   * Router constructor.
   */
  router() {
    const router = express.Router();
    router.use(JWTAuth);

    router.post('/',
      this.newExpense.validation,
      asyncMiddleware(this.newExpense.handler));

    router.delete('/:id',
      this.deleteExpense.validation,
      asyncMiddleware(this.deleteExpense.handler));

    router.post('/bulk',
      this.bulkAddExpenses.validation,
      asyncMiddleware(this.bulkAddExpenses.handler));

    router.post('/:id',
      this.updateExpense.validation,
      asyncMiddleware(this.updateExpense.handler));

    router.get('/',
      this.listExpenses.validation,
      asyncMiddleware(this.listExpenses.handler));

    return router;
  },

  /**
   * Saves a new expense.
   */
  newExpense: {
    validation: [
      check('date').optional().isISO8601(),
      check('payment_account_id').exists().isNumeric().toInt(),
      check('expense_account_id').exists().isNumeric().toInt(),
      check('description').optional(),
      check('amount').exists().isNumeric().toFloat(),
      check('currency_code').optional(),
      check('exchange_rate').optional().isNumeric().toFloat(),
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
      // Convert the date to the general format.
      form.date = moment(form.date).format('YYYY-MM-DD');

      const errorReasons = [];
      const paymentAccount = await Account.query()
        .findById(form.payment_account_id).first();

      if (!paymentAccount) {
        errorReasons.push({ type: 'PAYMENT.ACCOUNT.NOT.FOUND', code: 100 });
      }
      const expenseAccount = await Account.query()
        .findById(form.expense_account_id).first();

      if (!expenseAccount) {
        errorReasons.push({ type: 'EXPENSE.ACCOUNT.NOT.FOUND', code: 200 });
      }
      if (errorReasons.length > 0) {
        return res.status(400).send({ errors: errorReasons });
      }
      const expenseTransaction = await Expense.query().insert({ ...form });

      const journalEntries = new JournalPoster();
      const creditEntry = new JournalEntry({
        credit: form.amount,
        referenceId: expenseTransaction.id,
        referenceType: Expense.referenceType,
        date: form.date,
        account: expenseAccount.id,
        accountNormal: 'debit',
      });
      const debitEntry = new JournalEntry({
        debit: form.amount,
        referenceId: expenseTransaction.id,
        referenceType: Expense.referenceType,
        date: form.date,
        account: paymentAccount.id,
        accountNormal: 'debit',
      });
      journalEntries.credit(creditEntry);
      journalEntries.debit(debitEntry);

      await Promise.all([
        journalEntries.saveEntries(),
        journalEntries.saveBalance(),
      ]);
      return res.status(200).send({ id: expenseTransaction.id });
    },
  },

  /**
   * Bulk add expneses to the given accounts.
   */
  bulkAddExpenses: {
    validation: [
      check('expenses').exists().isArray({ min: 1 }),
      check('expenses.*.date').optional().isISO8601(),
      check('expenses.*.payment_account_id').exists().isNumeric().toInt(),
      check('expenses.*.expense_account_id').exists().isNumeric().toInt(),
      check('expenses.*.description').optional(),
      check('expenses.*.amount').exists().isNumeric().toFloat(),
      check('expenses.*.currency_code').optional(),
      check('expenses.*.exchange_rate').optional().isNumeric().toFloat(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const form = { ...req.body };
      const errorReasons = [];

      const paymentAccountsIds = chain(form.expenses)
        .map((e) => e.payment_account_id).uniq().value();
      const expenseAccountsIds = chain(form.expenses)
        .map((e) => e.expense_account_id).uniq().value();

      const [expensesAccounts, paymentAccounts] = await Promise.all([
        Account.query().whereIn('id', expenseAccountsIds),
        Account.query().whereIn('id', paymentAccountsIds),
      ]);
      const storedExpensesAccountsIds = expensesAccounts.map((a) => a.id);
      const storedPaymentAccountsIds = paymentAccounts.map((a) => a.id);

      const notFoundPaymentAccountsIds = difference(expenseAccountsIds, storedExpensesAccountsIds);
      const notFoundExpenseAccountsIds = difference(paymentAccountsIds, storedPaymentAccountsIds);

      if (notFoundPaymentAccountsIds.length > 0) {
        errorReasons.push({
          type: 'PAYMENY.ACCOUNTS.NOT.FOUND',
          code: 100,
          accounts: notFoundPaymentAccountsIds,
        });
      }
      if (notFoundExpenseAccountsIds.length > 0) {
        errorReasons.push({
          type: 'EXPENSE.ACCOUNTS.NOT.FOUND',
          code: 200,
          accounts: notFoundExpenseAccountsIds,
        });
      }
      if (errorReasons.length > 0) {
        return res.boom.badRequest(null, { reasons: errorReasons });
      }
      const expenseSaveOpers = [];
      const journalPoster = new JournalPoster();

      form.expenses.forEach(async (expense) => {
        const expenseSaveOper = Expense.query().insert({ ...expense });
        expenseSaveOpers.push(expenseSaveOper);
      });
      // Wait unit save all expense transactions.
      const savedExpenseTransactions = await Promise.all(expenseSaveOpers);

      savedExpenseTransactions.forEach((expense) => {
        const date = moment(expense.date).format('YYYY-DD-MM');

        const debit = new JournalEntry({
          debit: expense.amount,
          referenceId: expense.id,
          referenceType: Expense.referenceType,
          account: expense.payment_account_id,
          accountNormal: 'debit',
          date,
        });
        const credit = new JournalEntry({
          credit: expense.amount,
          referenceId: expense.id,
          referenceType: Expense.referenceId,
          account: expense.expense_account_id,
          accountNormal: 'debit',
          date,
        });
        journalPoster.credit(credit);
        journalPoster.debit(debit);
      });

      // Save expense journal entries and balance change.
      await Promise.all([
        journalPoster.saveEntries(),
        journalPoster.saveBalance(),
      ]);
      return res.status(200).send();
    },
  },

  /**
   * Retrieve paginated expenses list.
   */
  listExpenses: {
    validation: [
      query('expense_account_id').optional().isNumeric().toInt(),
      query('payment_account_id').optional().isNumeric().toInt(),
      query('note').optional(),
      query('range_from').optional().isNumeric().toFloat(),
      query('range_to').optional().isNumeric().toFloat(),
      query('date_from').optional().isISO8601(),
      query('date_to').optional().isISO8601(),
      query('column_sort_order').optional().isIn(['created_at', 'date', 'amount']),
      query('sort_order').optional().isIn(['desc', 'asc']),
      query('page').optional().isNumeric().toInt(),
      query('page_size').optional().isNumeric().toInt(),
      query('custom_view_id').optional().isNumeric().toInt(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const filter = {
        page_size: 10,
        page: 1,
        ...req.query,
      };
      const errorReasons = [];
      const expenseResource = await Resource.query().where('name', 'expenses').first();

      if (!expenseResource) {
        errorReasons.push({ type: 'EXPENSE_NOT_FOUND', code: 300 });
      }
      const view = await View.query().runBefore((result, q) => {
        if (filter.customer_view_id) {
          q.where('id', filter.customer_view_id);
        } else {
          q.where('favorite', true);
        }
        q.where('resource_id', expenseResource.id);
        q.withGraphFetched('viewRoles');
        q.withGraphFetched('columns');
        q.first();
        return result;
      });

      if (!view) {
        errorReasons.push({ type: 'VIEW_NOT_FOUND', code: 100 });
      }
      if (errorReasons.length > 0) {
        return res.boom.badRequest(null, { errors: errorReasons });
      }
      const expenses = await Expense.query()
        .modify('filterByAmountRange', filter.range_from, filter.to_range)
        .modify('filterByDateRange', filter.date_from, filter.date_to)
        .modify('filterByExpenseAccount', filter.expense_account_id)
        .modify('filterByPaymentAccount', filter.payment_account_id)
        .modify('orderBy', filter.column_sort_order, filter.sort_order)
        .page(filter.page, filter.page_size);
      
      return res.status(200).send({
        columns: view.columns,
        viewRoles: view.viewRoles,
      });
    },
  },

  /**
   * Delete the given account.
   */
  deleteExpense: {
    validation: [
      param('id').isNumeric().toInt(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const { id } = req.params;
      const expenseTransaction = await Expense.query().findById(id);

      if (!expenseTransaction) {
        return res.status(404).send({
          errors: [{ type: 'EXPENSE.TRANSACTION.NOT.FOUND', code: 100 }],
        });
      }
      const expenseEntries = await AccountTransaction.query()
        .where('reference_type', 'Expense')
        .where('reference_id', expenseTransaction.id);

      const expenseEntriesCollect = new JournalPoster();
      expenseEntriesCollect.loadEntries(expenseEntries);
      expenseEntriesCollect.reverseEntries();

      await Promise.all([
        expenseTransaction.delete(),
        expenseEntriesCollect.deleteEntries(),
        expenseEntriesCollect.saveBalance(),
      ]);
      return res.status(200).send();
    },
  },

  /**
   * Update details of the given account.
   */
  updateExpense: {
    validation: [
      param('id').isNumeric().toInt(),
      check('date').optional().isISO8601(),
      check('payment_account_id').exists().isNumeric().toInt(),
      check('expense_account_id').exists().isNumeric().toInt(),
      check('description').optional(),
      check('amount').exists().isNumeric().toFloat(),
      check('currency_code').optional(),
      check('exchange_rate').optional().isNumeric().toFloat(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const { id } = req.params;
      const expenseTransaction = await Expense.query().findById(id);

      if (!expenseTransaction) {
        return res.status(404).send({
          errors: [{ type: 'EXPENSE.TRANSACTION.NOT.FOUND', code: 100 }],
        });
      }
    },
  },
};
