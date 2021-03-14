import { Inject, Service } from 'typedi';
import { Request, Response, Router, NextFunction } from 'express';
import { query, ValidationChain } from 'express-validator';
import { castArray } from 'lodash';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import TrialBalanceSheetService from 'services/FinancialStatements/TrialBalanceSheet/TrialBalanceSheetService';
import BaseFinancialReportController from './BaseFinancialReportController';

@Service()
export default class TrialBalanceSheetController extends BaseFinancialReportController {
  @Inject()
  trialBalanceSheetService: TrialBalanceSheetService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/',
      this.trialBalanceSheetValidationSchema,
      this.validationResult,
      asyncMiddleware(this.trialBalanceSheet.bind(this))
    );
    return router;
  }

  /**
   * Validation schema.
   * @return {ValidationChain[]}
   */
  get trialBalanceSheetValidationSchema(): ValidationChain[] {
    return [
      ...this.sheetNumberFormatValidationSchema,
      query('basis').optional(),
      query('from_date').optional().isISO8601(),
      query('to_date').optional().isISO8601(),
      query('account_ids').isArray().optional(),
      query('account_ids.*').isNumeric().toInt(),
      query('basis').optional(),
      query('none_zero').optional().isBoolean().toBoolean(),
    ];
  }

  /**
   * Retrieve the trial balance sheet.
   */
  public async trialBalanceSheet(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId, settings } = req;
    let filter = this.matchedQueryData(req);

    filter = {
      ...filter,
      accountsIds: castArray(filter.accountsIds),
    };
 
    try {
      const {
        data,
        query,
        meta
      } = await this.trialBalanceSheetService.trialBalanceSheet(
        tenantId,
        filter
      );

      return res.status(200).send({
        data: this.transfromToResponse(data),
        query: this.transfromToResponse(query),
        meta: this.transfromToResponse(meta),
      });
    } catch (error) {
      next(error);
    }
  }
}
