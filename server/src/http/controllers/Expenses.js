import express from 'express';
import {
  check,
  param,
  query,
  validationResult,
} from 'express-validator';
import moment from 'moment';
import { difference, sumBy, omit } from 'lodash';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import JournalPoster from '@/services/Accounting/JournalPoster';
import JournalEntry from '@/services/Accounting/JournalEntry';
import JWTAuth from '@/http/middleware/jwtAuth';
import {
  mapViewRolesToConditionals,
} from '@/lib/ViewRolesBuilder';
import {
  DynamicFilter,
  DynamicFilterSortBy,
  DynamicFilterViews,
  DynamicFilterFilterRoles,
} from '@/lib/DynamicFilter';


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

    router.post('/:id/publish',
      this.publishExpense.validation,
      asyncMiddleware(this.publishExpense.handler));

    router.delete('/:id',
      this.deleteExpense.validation,
      asyncMiddleware(this.deleteExpense.handler));

    router.delete('/',
      this.deleteBulkExpenses.validation,
      asyncMiddleware(this.deleteBulkExpenses.handler));

    router.post('/:id',
      this.updateExpense.validation,
      asyncMiddleware(this.updateExpense.handler));

    router.get('/',
      this.listExpenses.validation,
      asyncMiddleware(this.listExpenses.handler));

    router.get('/:id',
      this.getExpense.validation,
      asyncMiddleware(this.getExpense.handler));

    return router;
  },

  /**
   * Saves a new expense.
   */
  newExpense: {
    validation: [
      check('reference_no').optional().trim().escape(),
      check('payment_date').isISO8601().optional(),
      check('payment_account_id').exists().isNumeric().toInt(),
      check('description').optional(),
      check('currency_code').optional(),
      check('exchange_rate').optional().isNumeric().toFloat(),
      check('publish').optional().isBoolean().toBoolean(),

      check('categories').exists().isArray({ min: 1 }),
      check('categories.*.index').exists().isNumeric().toInt(),
      check('categories.*.expense_account_id').exists().isNumeric().toInt(),
      check('categories.*.amount').optional().isNumeric().toFloat(),
      check('categories.*.description').optional().trim().escape(),

      check('custom_fields').optional().isArray({ min: 0 }),
      check('custom_fields.*.key').exists().trim().escape(),
      check('custom_fields.*.value').exists(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const { user } = req;
      const { Expense, ExpenseCategory, Account } = req.models;

      const form = {
        date: new Date(),
        published: false,
        custom_fields: [],
        categories: [],
        ...req.body,
      };
      const totalAmount = sumBy(form.categories, 'amount');
      const expenseAccountsIds = form.categories.map((account) => account.expense_account_id)

      const storedExpenseAccounts = await Account.query().whereIn('id', expenseAccountsIds);
      const storedExpenseAccountsIds = storedExpenseAccounts.map(a => a.id);
      
      const notStoredExpensesAccountsIds = difference(expenseAccountsIds, storedExpenseAccountsIds);
      const errorReasons = [];

      const paymentAccount = await Account.query().where('id', form.payment_account_id).first();

      if (!paymentAccount) {
        errorReasons.push({
          type: 'PAYMENT.ACCOUNT.NOT.FOUND', code: 500, 
        });
      }
      if (notStoredExpensesAccountsIds.length > 0) {
        errorReasons.push({
          type: 'EXPENSE.ACCOUNTS.IDS.NOT.STORED', code: 400, ids: notStoredExpensesAccountsIds,
        });
      }
      if (totalAmount <= 0) {
        errorReasons.push({ type: 'TOTAL.AMOUNT.EQUALS.ZERO', code: 300 });
      }
      if (errorReasons.length > 0) {
        return res.status(400).send({ errors: errorReasons });
      }
  
      const expenseTransaction = await Expense.query().insert({
        total_amount: totalAmount,
        payment_account_id: form.payment_account_id,
        reference_no: form.reference_no,
        description: form.description,
        payment_date: moment(form.payment_date).format('YYYY-MM-DD'),
        user_id: user.id,
      });
      const storeExpenseCategoriesOper = [];

      form.categories.forEach((category) => {
        const oper = ExpenseCategory.query().insert({
          expense_id: expenseTransaction.id,
          ...category,
        });
        storeExpenseCategoriesOper.push(oper);
      }); 

      const accountsDepGraph = await Account.depGraph().query();
      const journalPoster = new JournalPoster(accountsDepGraph);

      const mixinEntry = {
        referenceType: 'Expense',
        referenceId: expenseTransaction.id,
        userId: user.id,
        draft: !form.publish,  
      };
      const paymentJournalEntry = new JournalEntry({
        credit: totalAmount,
        account: paymentAccount.id,
        ...mixinEntry,
      });
      journalPoster.credit(paymentJournalEntry)

      form.categories.forEach((category) => {
        const expenseJournalEntry = new JournalEntry({
          account: category.expense_account_id,
          debit: category.amount,
          note: category.description,
          ...mixinEntry,
        });
        journalPoster.debit(expenseJournalEntry);
      });
      await Promise.all([
        ...storeExpenseCategoriesOper,
        journalPoster.saveEntries(),
        (form.status) && journalPoster.saveBalance(),
      ]);
      
      return res.status(200).send({ id: expenseTransaction.id });
    },
  },

  /**
   * Publish the given expense id.
   */
  publishExpense: {
    validation: [
      param('id').exists().isNumeric().toInt(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const { id } = req.params;
      const { Expense, Account, AccountTransaction } = req.models;
      const expense = await Expense.query().findById(id);
      const errorReasons = [];

      if (!expense) {
        errorReasons.push({ type: 'EXPENSE.NOT.FOUND', code: 100 });
        return res.status(400).send({ errors: errorReasons });
      }
      if (expense.published) {
        errorReasons.push({ type: 'EXPENSE.ALREADY.PUBLISHED', code: 200 });
      }
      if (errorReasons.length > 0) {
        return res.status(400).send({ errors: errorReasons });
      }
      const transactions = await AccountTransaction.query()
        .whereIn('reference_type', ['Expense'])
        .where('reference_id', expense.id)
        .withGraphFetched('account.type');

      const accountsDepGraph = await Account.depGraph().query().remember();
      const journal = new JournalPoster(accountsDepGraph);

      journal.loadEntries(transactions);
      journal.calculateEntriesBalanceChange();

      const updateAccTransactionsOper = AccountTransaction.query()
        .where('reference_id', expense.id)
        .where('reference_type', 'Expense')
        .patch({
          draft: false,
        });

      const updateExpenseOper = Expense.query()
        .where('id', expense.id)
        .update({ published: true });

      await Promise.all([
        updateAccTransactionsOper,
        updateExpenseOper,
        journal.saveBalance(),
      ]);
      return res.status(200).send();
    },
  },

  /**
   * Retrieve paginated expenses list.
   */
  listExpenses: {
    validation: [      
      query('page').optional().isNumeric().toInt(),
      query('page_size').optional().isNumeric().toInt(),

      query('custom_view_id').optional().isNumeric().toInt(),
      query('stringified_filter_roles').optional().isJSON(),

      query('column_sort_by').optional(),
      query('sort_order').optional().isIn(['desc', 'asc']),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }

      const filter = {
        sort_order: 'asc',
        filter_roles: [],
        page_size: 15,
        page: 1,
        ...req.query,
      };
      const errorReasons = [];
      const { Resource, Expense, View } = req.models;

      const expensesResource = await Resource.query()
        .remember()
        .where('name', 'expenses')
        .withGraphFetched('fields')
        .first();
    
      const expensesResourceFields = expensesResource.fields.map(f => f.key);

      if (!expensesResource) {
        return res.status(400).send({
          errors: [{ type: 'EXPENSES.RESOURCE.NOT.FOUND', code: 200 }],
        });
      }
      const view = await View.query().onBuild((builder) => {
        if (filter.csutom_view_id) {
          builder.where('id', filter.csutom_view_id);
        } else {
          builder.where('favourite', true);
        }
        builder.withGraphFetched('roles.field');
        builder.withGraphFetched('columns');
        builder.first();
      });
      const dynamicFilter = new DynamicFilter(Expense.tableName);

      // Column sorting.
      if (filter.column_sort_by) {
        if (expensesResourceFields.indexOf(filter.column_sort_by) === -1) {
          errorReasons.push({ type: 'COLUMN.SORT.ORDER.NOT.FOUND', code: 300 });
        }
        const sortByFilter = new DynamicFilterSortBy(
          filter.column_sort_by,
          filter.sort_order,
        );
        dynamicFilter.setFilter(sortByFilter);      
      }
      // Custom view roles.
      if (view && view.roles.length > 0) {
        const viewFilter = new DynamicFilterViews(
          mapViewRolesToConditionals(view.roles),
          view.rolesLogicExpression,
        );
        if (viewFilter.validateFilterRoles()) {
          errorReasons.push({ type: 'VIEW.LOGIC.EXPRESSION.INVALID', code: 400 });
        }
        dynamicFilter.setFilter(viewFilter);
      }
      // Filter roles.
      if (filter.filter_roles.length > 0) {
        const filterRoles = new DynamicFilterFilterRoles(
          mapFilterRolesToDynamicFilter(filter.filter_roles),
          expensesResource.fields,
        );
        if (filterRoles.validateFilterRoles().length > 0) {
          errorReasons.push({ type: 'ACCOUNTS.RESOURCE.HAS.NO.GIVEN.FIELDS', code: 500 });
        }
        dynamicFilter.setFilter(filterRoles);
      }
      if (errorReasons.length > 0) {
        return res.status(400).send({ errors: errorReasons });
      }
      const expenses = await Expense.query().onBuild((builder) => {
        builder.withGraphFetched('paymentAccount');
        builder.withGraphFetched('categories.expenseAccount');
        builder.withGraphFetched('user');
        dynamicFilter.buildQuery()(builder);
      }).pagination(filter.page - 1, filter.page_size);;

      return res.status(200).send({
        expenses: {
          ...expenses,
          ...(view) ? {
            viewMeta: {
              viewColumns: view.columns,
              customViewId: view.id,
            }
           } : {},
        },
      });
    },
  },

  /**
   * Delete the given expense transaction.
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
      const {
        Expense,
        ExpenseCategory,
        AccountTransaction,
        Account,
      } = req.models;

      const expense = await Expense.query().where('id', id).first();

      if (!expense) {
        return res.status(404).send({ errors: [{
          type: 'EXPENSE.NOT.FOUND', code: 200,
        }] });
      }
      await ExpenseCategory.query().where('expense_id', id).delete();
      
      const deleteExpenseOper = Expense.query().where('id', id).delete();
      const expenseTransactions = await AccountTransaction.query()
        .where('reference_type', 'Expense')
        .where('reference_id', expense.id);

      const accountsDepGraph = await Account.depGraph().query().remember();
      const journalEntries = new JournalPoster(accountsDepGraph);

      journalEntries.loadEntries(expenseTransactions);
      journalEntries.removeEntries();

      await Promise.all([
        deleteExpenseOper,
        journalEntries.deleteEntries(),
        journalEntries.saveBalance(),
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
      check('reference_no').optional().trim().escape(),
      check('payment_date').isISO8601().optional(),
      check('payment_account_id').exists().isNumeric().toInt(),
      check('description').optional(),
      check('currency_code').optional(),
      check('exchange_rate').optional().isNumeric().toFloat(),
      check('publish').optional().isBoolean().toBoolean(),

      check('categories').exists().isArray({ min: 1 }),
      check('categories.*.id').optional().isNumeric().toInt(),
      check('categories.*.index').exists().isNumeric().toInt(),
      check('categories.*.expense_account_id').exists().isNumeric().toInt(),
      check('categories.*.amount').optional().isNumeric().toFloat(),
      check('categories.*.description').optional().trim().escape(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const { id } = req.params;
      const { user } = req;
      const { Account, Expense, ExpenseCategory, AccountTransaction } = req.models;

      const form = {
        categories: [],
        ...req.body,
      };
      if (!Array.isArray(form.categories)) {
        form.categories = [form.categories];
      }
      const expense = await Expense.query()
        .where('id', id)
        .withGraphFetched('categories')
        .first();

      if (!expense) {
        return res.status(404).send({
          errors: [{ type: 'EXPENSE.NOT.FOUND', code: 200 }],
        });
      }
      const errorReasons = [];
      const paymentAccount = await Account.query()
        .where('id', form.payment_account_id).first();

      if (!paymentAccount) {
        errorReasons.push({ type: 'PAYMENT.ACCOUNT.NOT.FOUND', code: 400 });
      }
      const categoriesHasNoId = form.categories.filter(c => !c.id);
      const categoriesHasId = form.categories.filter(c => c.id);

      const expenseCategoriesIds = expense.categories.map((c) => c.id);
      const formExpenseCategoriesIds = categoriesHasId.map(c => c.id);

      const categoriesIdsDeleted = difference(
        formExpenseCategoriesIds, expenseCategoriesIds,
      );
      const categoriesShouldDelete = difference(
        expenseCategoriesIds, formExpenseCategoriesIds,
      );

      const formExpensesAccountsIds = form.categories.map(c => c.expense_account_id);
      const storedExpenseAccounts = await Account.query().whereIn('id', formExpensesAccountsIds);
      const storedExpenseAccountsIds = storedExpenseAccounts.map(a => a.id);

      const expenseAccountsIdsNotFound = difference(
        formExpensesAccountsIds, storedExpenseAccountsIds,
      ); 
      const totalAmount = sumBy(form.categories, 'amount');

      if (expenseAccountsIdsNotFound.length > 0) {
        errorReasons.push({ type: 'EXPENSE.ACCOUNTS.IDS.NOT.FOUND', code: 600, ids: expenseAccountsIdsNotFound })
      }

      if (categoriesIdsDeleted.length > 0) {
        errorReasons.push({ type: 'EXPENSE.CATEGORIES.IDS.NOT.FOUND', code: 300 });
      }
      if (totalAmount <= 0) {
        errorReasons.push({ type: 'TOTAL.AMOUNT.EQUALS.ZERO', code: 500 });
      }
      // Handle all error reasons.
      if (errorReasons.length > 0) {
        return res.status(400).send({ errors: errorReasons });
      }
      const expenseCategoriesMap = new Map(expense.categories
          .map(category => [category.id, category]));

      const categoriesInsertOpers = [];
      const categoriesUpdateOpers = [];
      
      categoriesHasNoId.forEach((category) => {
        const oper = ExpenseCategory.query().insert({
          ...category,
          expense_id: expense.id,
        });
        categoriesInsertOpers.push(oper);
      });

      categoriesHasId.forEach((category) => { 
        const oper = ExpenseCategory.query().where('id', category.id)
          .patch({
            ...omit(category, ['id']),
          });
        categoriesUpdateOpers.push(oper);
      });

      const updateExpenseOper = Expense.query().where('id', id)
        .update({
          payment_date: moment(form.payment_date).format('YYYY-MM-DD'),
          total_amount: totalAmount,
          description: form.description,
          payment_account_id: form.payment_account_id,
          reference_no: form.reference_no,
        })

      const deleteCategoriesOper = (categoriesShouldDelete.length > 0) ?
        ExpenseCategory.query().whereIn('id', categoriesShouldDelete).delete() : 
        Promise.resolve();

      // Update the journal entries.
      const transactions = await AccountTransaction.query()
        .whereIn('reference_type', ['Expense'])
        .where('reference_id', expense.id)
        .withGraphFetched('account.type');

      const accountsDepGraph = await Account.depGraph().query().remember();
      const journal = new JournalPoster(accountsDepGraph);

      journal.loadEntries(transactions);
      journal.removeEntries();

      const mixinEntry = {
        referenceType: 'Expense',
        referenceId: expense.id,
        userId: user.id,
        draft: !form.publish,  
      };
      const paymentJournalEntry = new JournalEntry({
        credit: totalAmount,
        account: paymentAccount.id,
        ...mixinEntry,
      });
      journal.credit(paymentJournalEntry);

      form.categories.forEach((category) => {
        const entry = new JournalEntry({
          account: category.expense_account_id,
          debit: category.amount,
          note: category.description,
          ...mixinEntry,
        });
        journal.debit(entry);
      });
      
      await Promise.all([
        ...categoriesInsertOpers,
        ...categoriesUpdateOpers,
        updateExpenseOper,
        deleteCategoriesOper,

        journal.saveEntries(),
        (form.status) && journal.saveBalance(),
      ]);
      return res.status(200).send({ id });
    },
  },

  /**
   * Retrieve details of the given expense id.
   */
  getExpense: {
    validation: [
      param('id').exists().isNumeric().toInt(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const { id } = req.params;
      const { Expense, AccountTransaction } = req.models;

      const expense = await Expense.query()
        .where('id', id)
        .withGraphFetched('categories')
        .withGraphFetched('paymentAccount')
        .withGraphFetched('user')
        .first();

      if (!expense) {
        return res.status(404).send({
          errors: [{ type: 'EXPENSE.NOT.FOUND', code: 200 }],
        });
      }

      const journalEntries = await AccountTransaction.query()
        .where('reference_id', expense.id)
        .where('reference_type', 'Expense');

      return res.status(200).send({
        expense: {
          ...expense,
          journalEntries,
        }
      });
    },
  },

  /**
   * Deletes bulk expenses.
   */
  deleteBulkExpenses: {
    validation: [
      query('ids').isArray({ min: 1 }),
      query('ids.*').isNumeric().toInt(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const filter = { ...req.query };
      const { Expense, AccountTransaction, Account, MediaLink } = req.models;

      const expenses = await Expense.query()
        .whereIn('id', filter.ids)

      const storedExpensesIds = expenses.map(e => e.id);
      const notFoundExpenses = difference(filter.ids, storedExpensesIds);

      if (notFoundExpenses.length > 0) {
        return res.status(404).send({
          errors: [{ type: 'EXPENSES.NOT.FOUND', code: 200 }],
        });
      }

      const deleteExpensesOper = Expense.query()
        .whereIn('id', storedExpensesIds).delete();

      const transactions = await AccountTransaction.query()
        .whereIn('reference_type', ['Expense'])
        .whereIn('reference_id', filter.ids)

      const accountsDepGraph = await Account.depGraph().query().remember();
      const journal = new JournalPoster(accountsDepGraph);

      journal.loadEntries(transactions);
      journal.removeEntries();

      await MediaLink.query()
        .where('model_name', 'Expense')
        .whereIn('model_id', filter.ids)
        .delete();

      await Promise.all([
        deleteExpensesOper,
        journal.deleteEntries(),
        journal.saveBalance(),
      ]);
      return res.status(200).send({ ids: filter.ids });
    }
  }
};
