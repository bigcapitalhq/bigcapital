import express from 'express';
import {
  check,
  query,
  param,
  validationResult,
} from 'express-validator';
import { pick, difference, groupBy } from 'lodash';
import asyncMiddleware from "@/http/middleware/asyncMiddleware";
import JWTAuth from '@/http/middleware/jwtAuth';
import Budget from '@/models/Budget';
import BudgetEntry from '@/models/BudgetEntry';
import Account from '@/models/Account';
import moment from '@/services/Moment';
import BudgetEntriesSet from '@/collection/BudgetEntriesSet';
import AccountType from '@/models/AccountType';
import NestedSet from '@/collection/NestedSet';
import { dateRangeFormat } from '@/utils';


export default {
  /**
   * Router constructor.
   */
  router() {
    const router = express.Router();

    router.use(JWTAuth);

    router.post('/',
      this.newBudget.validation,
      asyncMiddleware(this.newBudget.handler));

    router.get('/:id',
      this.getBudget.validation,
      asyncMiddleware(this.getBudget.handler));

    router.get('/:id',
      this.deleteBudget.validation,
      asyncMiddleware(this.deleteBudget.handler));

    router.get('/',
      this.listBudgets.validation,
      asyncMiddleware(this.listBudgets.handler));

    return router;
  },

  /**
   * Retrieve budget details of the given id.
   */
  getBudget: {
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
      const budget = await Budget.query().findById(id);

      if (!budget) {
        return res.status(404).send({
          errors: [{ type: 'budget.not.found', code: 100 }],
        });
      }
      const accountTypes = await AccountType.query().where('balance_sheet', true);

      const [budgetEntries, accounts] = await Promise.all([
        BudgetEntry.query().where('budget_id', budget.id),
        Account.query().whereIn('account_type_id', accountTypes.map((a) => a.id)),
      ]);

      const accountsNestedSet = new NestedSet(accounts);

      const columns = [];
      const fromDate = moment(budget.year).startOf('year')
        .add(budget.rangeOffset, budget.rangeBy).toDate();

      const toDate = moment(budget.year).endOf('year').toDate();

      const dateRange = moment.range(fromDate, toDate);
      const dateRangeCollection = Array.from(dateRange.by(budget.rangeBy, {
        step: budget.rangeIncrement, excludeEnd: false, excludeStart: false,
      }));

      dateRangeCollection.forEach((date) => {
        columns.push(date.format(dateRangeFormat(budget.rangeBy)));
      });
      const budgetEntriesSet = BudgetEntriesSet.from(budgetEntries, {
        orderSize: columns.length,
      });
      budgetEntriesSet.setZeroPlaceholder();
      budgetEntriesSet.calcTotalSummary();

      return res.status(200).send({
        columns,
        accounts: budgetEntriesSet.toArray(),
        total: budgetEntriesSet.toArrayTotalSummary(),
      });
    },
  },

  /**
   * Delete the given budget.
   */
  deleteBudget: {
    validation: [
      param('id').exists(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }

      const { id } = req.params;
      const budget = await Budget.query().findById(id);

      if (!budget) {
        return res.status(404).send({
          errors: [{ type: 'budget.not.found', code: 100 }],
        });
      }
      await BudgetEntry.query().where('budget_id', budget.id).delete();
      await budget.delete();

      return res.status(200).send();
    },
  },

  /**
   * Saves the new budget.
   */
  newBudget: {
    validation: [
      check('name').exists(),
      check('fiscal_year').exists(),
      check('period').exists().isIn(['year', 'month', 'quarter', 'half-year']),
      check('accounts_type').exists().isIn(['balance_sheet', 'profit_loss']),
      check('accounts').isArray(),
      check('accounts.*.account_id').exists().isNumeric().toInt(),
      check('accounts.*.entries').exists().isArray(),
      check('accounts.*.entries.*.amount').exists().isNumeric().toFloat(),
      check('accounts.*.entries.*.order').exists().isNumeric().toInt(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }

      const form = { ...req.body };
      const submitAccountsIds = form.accounts.map((a) => a.account_id);
      const storedAccounts = await Account.query().whereIn('id', submitAccountsIds);
      const storedAccountsIds = storedAccounts.map((a) => a.id);

      const errorReasons = [];
      const notFoundAccountsIds = difference(submitAccountsIds, storedAccountsIds);

      if (notFoundAccountsIds.length > 0) {
        errorReasons.push({
          type: 'ACCOUNT.NOT.FOUND', code: 200, accounts: notFoundAccountsIds,
        });
      }
      if (errorReasons.length > 0) {
        return res.status(400).send({ errors: errorReasons });
      }
      // validation entries order.
      const budget = await Budget.query().insert({
        ...pick(form, ['name', 'fiscal_year', 'period', 'accounts_type']),
      });

      const promiseOpers = [];

      form.accounts.forEach((account) => {
        account.entries.forEach((entry) => {
          const budgetEntry = BudgetEntry.query().insert({
            account_id: account.account_id,
            amount: entry.amount,
            order: entry.order,
          });
          promiseOpers.push(budgetEntry);
        });
      });
      await Promise.all(promiseOpers);

      return res.status(200).send({ id: budget.id });
    },
  },

  /**
   * List of paginated budgets items.
   */
  listBudgets: {
    validation: [
      query('year').optional(),
      query('income_statement').optional().isBoolean().toBoolean(),
      query('profit_loss').optional().isBoolean().toBoolean(),
      query('page').optional().isNumeric().toInt(),
      query('page_size').isNumeric().toInt(),
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
      const budgets = await Budget.query().runBefore((result, q) => {
        if (filter.profit_loss) {
          q.modify('filterByYear', filter.year);
        }
        if (filter.income_statement) {
          q.modify('filterByIncomeStatement', filter.income_statement);
        }
        if (filter.profit_loss) {
          q.modify('filterByProfitLoss', filter.profit_loss);
        }
        q.page(filter.page, filter.page_size);
        return result;
      });
      return res.status(200).send({
        items: budgets.items,
      });
    },
  },
};
