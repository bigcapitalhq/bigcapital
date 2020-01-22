import express from 'express';
import { query, validationResult } from 'express-validator';
import moment from 'moment';
import jwtAuth from '@/http/middleware/jwtAuth';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import Budget from '@/models/Budget';
import Account from '@/models/Account';
import AccountType from '@/models/AccountType';
import NestedSet from '@/collection/NestedSet';
import BudgetEntry from '@/models/BudgetEntry';
import { dateRangeFormat } from '@/utils';

export default {

  /**
   * Router constructor.
   */
  router() {
    const router = express.Router();

    router.use(jwtAuth);

    router.get('/budget_verses_actual/:reportId',
      this.budgetVersesActual.validation,
      asyncMiddleware(this.budgetVersesActual.handler));

    return router;
  },

  budgetVersesActual: {
    validation: [
      query('basis').optional().isIn(['cash', 'accural']),
      query('period').optional(),
      query('active_accounts').optional().toBoolean(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const { reportId } = req.params;
      const form = { ...req.body };
      const errorReasons = [];

      const budget = await Budget.query().findById(reportId);

      if (!budget) {
        errorReasons.push({ type: 'BUDGET_NOT_FOUND', code: 100 });
      }
      const budgetEntries = await BudgetEntry.query().where('budget_id', budget.id);

      if (errorReasons.length > 0) {
        return res.status(400).send({ errors: errorReasons });
      }
      const accountTypes = await AccountType.query()
        .where('balance_sheet', budget.accountTypes === 'balance_sheet')
        .where('income_sheet', budget.accountTypes === 'profit_losss');

      const accounts = await Account.query().runBefore((result, q) => {
        const accountTypesIds = accountTypes.map((t) => t.id);

        if (accountTypesIds.length > 0) {
          q.whereIn('account_type_id', accountTypesIds);
        }
        q.where('active', form.active_accounts === true);
        q.withGraphFetched('transactions');
      });
        
      // const accountsNestedSet = NestedSet.from(accounts);

      const fromDate = moment(budget.year).startOf('year')
        .add(budget.rangeOffset, budget.rangeBy).toDate();

      const toDate = moment(budget.year).endOf('year').toDate();

      const dateRange = moment.range(fromDate, toDate);
      const dateRangeCollection = Array.from(dateRange.by(budget.rangeBy, {
        step: budget.rangeIncrement, excludeEnd: false, excludeStart: false,
      }));

    //   // const accounts = {
    //   //   assets: [
    //   //     {
    //   //       name: '',
    //   //       code: '',
    //   //       totalEntries: [
    //   //         {

    //   //         }
    //   //       ],
    //   //       children: [
    //   //         {
    //   //           name: '',
    //   //           code: '',
    //   //           entries: [
    //   //             {

    //   //             }
    //   //           ]
    //   //         }
    //   //       ]
    //   //     }
    //   //   ]
    //   // }

      return res.status(200).send({
        columns: dateRangeCollection.map(d => d.format(dateRangeFormat(budget.rangeBy))),
        // accounts: {
        //   asset: [],
        //   liabilities: [],
        //   equaity: [],

        //   income: [],
        //   expenses: [],
        // }
      });
    },
  },
}