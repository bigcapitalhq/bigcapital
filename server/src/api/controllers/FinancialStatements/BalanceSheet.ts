import { Inject, Service } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { query, ValidationChain } from 'express-validator';
import { castArray } from 'lodash';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import BaseController from '../BaseController';
import BalanceSheetStatementService from 'services/FinancialStatements/BalanceSheet/BalanceSheetService';

@Service()
export default class BalanceSheetStatementController extends BaseController {
  @Inject()
  balanceSheetService: BalanceSheetStatementService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/',
      this.balanceSheetValidationSchema,
      this.validationResult,
      asyncMiddleware(this.balanceSheet.bind(this))
    );
    return router;
  }

  /**
   * Balance sheet validation schecma.
   * @returns {ValidationChain[]}
   */
  get balanceSheetValidationSchema(): ValidationChain[] {
    return [
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
      query('none_transactions').optional().isBoolean().toBoolean(),
    ];
  }

  /**
   * Retrieve the balance sheet.
   */
  async balanceSheet(req: Request, res: Response, next: NextFunction) {
    const { tenantId, settings } = req;
    let filter = this.matchedQueryData(req);

    filter = {
      ...filter,
      accountsIds: castArray(filter.accountsIds),
    };
    const organizationName = settings.get({
      group: 'organization',
      key: 'name',
    });
    const baseCurrency = settings.get({
      group: 'organization',
      key: 'base_currency',
    });

    try {
      const {
        data,
        columns,
        query,
      } = await this.balanceSheetService.balanceSheet(tenantId, filter);

      return res.status(200).send({
        organization_name: organizationName,
        base_currency: baseCurrency,
        data: this.transfromToResponse(data),
        columns: this.transfromToResponse(columns),
        query: this.transfromToResponse(query),
      });
    } catch (error) {
      next(error);
    }
  }
}
