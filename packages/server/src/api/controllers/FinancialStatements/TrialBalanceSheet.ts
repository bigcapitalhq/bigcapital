import { Inject, Service } from 'typedi';
import { Request, Response, Router, NextFunction } from 'express';
import { query, ValidationChain } from 'express-validator';
import { castArray } from 'lodash';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import TrialBalanceSheetService from '@/services/FinancialStatements/TrialBalanceSheet/TrialBalanceSheetService';
import BaseFinancialReportController from './BaseFinancialReportController';
import { AbilitySubject, ReportsAction } from '@/interfaces';
import CheckPolicies from '@/api/middleware/CheckPolicies';

@Service()
export default class TrialBalanceSheetController extends BaseFinancialReportController {
  @Inject()
  trialBalanceSheetService: TrialBalanceSheetService;

  /**
   * Router constructor.
   */
  public router() {
    const router = Router();

    router.get(
      '/',
      CheckPolicies(
        ReportsAction.READ_TRIAL_BALANCE_SHEET,
        AbilitySubject.Report
      ),
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
  private get trialBalanceSheetValidationSchema(): ValidationChain[] {
    return [
      ...this.sheetNumberFormatValidationSchema,
      query('basis').optional(),
      query('from_date').optional().isISO8601(),
      query('to_date').optional().isISO8601(),
      query('account_ids').isArray().optional(),
      query('account_ids.*').isNumeric().toInt(),
      query('basis').optional(),

      query('none_zero').optional().isBoolean().toBoolean(),
      query('none_transactions').optional().isBoolean().toBoolean(),
      query('only_active').optional().isBoolean().toBoolean(),

      // Filtering by branches.
      query('branches_ids').optional().toArray().isArray({ min: 1 }),
      query('branches_ids.*').isNumeric().toInt(),
    ];
  }

  /**
   * Retrieve the trial balance sheet.
   */
  private async trialBalanceSheet(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    let filter = this.matchedQueryData(req);

    filter = {
      ...filter,
      accountsIds: castArray(filter.accountsIds),
    };
    try {
      const accept = this.accepts(req);
      const acceptType = accept.types(['json', 'application/json+table']);

      if (acceptType === 'application/json+table') {
        const { table, meta, query } =
          await this.trialBalanceSheetService.trialBalanceSheetTable(
            tenantId,
            filter
          );
        return res.status(200).send({ table, meta, query });
      } else {
        const { data, query, meta } =
          await this.trialBalanceSheetService.trialBalanceSheet(
            tenantId,
            filter
          );
        return res.status(200).send({ data, query, meta });
      }
    } catch (error) {
      next(error);
    }
  }
}
