import { Inject, Service } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { query, ValidationChain } from 'express-validator';
import { castArray } from 'lodash';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import BalanceSheetStatementService from 'services/FinancialStatements/BalanceSheet/BalanceSheetService';
import BaseFinancialReportController from './BaseFinancialReportController';

@Service()
export default class BalanceSheetStatementController extends BaseFinancialReportController {
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
      ...this.sheetNumberFormatValidationSchema,
      query('accounting_method').optional().isIn(['cash', 'accural']),
      query('from_date').optional(),
      query('to_date').optional(),
      query('display_columns_type').optional().isIn(['date_periods', 'total']),
      query('display_columns_by')
        .optional({ nullable: true, checkFalsy: true })
        .isIn(['year', 'month', 'week', 'day', 'quarter']),
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
    
    try {
      const {
        data,
        columns,
        query,
        meta,
      } = await this.balanceSheetService.balanceSheet(tenantId, filter);

      return res.status(200).send({
        data: this.transfromToResponse(data),
        columns: this.transfromToResponse(columns),
        query: this.transfromToResponse(query),
        meta: this.transfromToResponse(meta),
      });
    } catch (error) {
      next(error);
    }
  }
}
