import { Router, Request, Response, NextFunction } from 'express';
import { query } from 'express-validator';
import { Inject } from 'typedi';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import APAgingSummaryReportService from 'services/FinancialStatements/AgingSummary/APAgingSummaryService';
import BaseFinancialReportController from './BaseFinancialReportController';

export default class APAgingSummaryReportController extends BaseFinancialReportController {
  @Inject()
  APAgingSummaryService: APAgingSummaryReportService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/',
      this.validationSchema,
      asyncMiddleware(this.payableAgingSummary.bind(this))
    );
    return router;
  }

  /**
   * Validation schema.
   */
  get validationSchema() {
    return [
      ...this.sheetNumberFormatValidationSchema,
      query('as_date').optional().isISO8601(),
      query('aging_days_before').optional().isNumeric().toInt(),
      query('aging_periods').optional().isNumeric().toInt(),
      query('vendors_ids').optional().isArray({ min: 1 }),
      query('vendors_ids.*').isInt({ min: 1 }).toInt(),
      query('none_zero').default(true).isBoolean().toBoolean(),
    ];
  }
 
  /**
   * Retrieve payable aging summary report.
   */
  async payableAgingSummary(req: Request, res: Response, next: NextFunction) {
    const { tenantId, settings } = req;
    const filter = this.matchedQueryData(req);

    try {
      const {
        data,
        columns,
        query,
        meta
      } = await this.APAgingSummaryService.APAgingSummary(tenantId, filter);

      return res.status(200).send({
        data: this.transfromToResponse(data),
        columns: this.transfromToResponse(columns),
        query: this.transfromToResponse(query),
        meta: this.transfromToResponse(meta)
      });
    } catch (error) {
      next(error);
    }
  }
}
