import { Router, Request, Response, NextFunction } from 'express';
import { query } from 'express-validator';
import { Inject } from 'typedi';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import APAgingSummaryReportService from '@/services/FinancialStatements/AgingSummary/APAgingSummaryService';
import BaseFinancialReportController from './BaseFinancialReportController';
import { AbilitySubject, ReportsAction } from '@/interfaces';
import CheckPolicies from '@/api/middleware/CheckPolicies';

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
      CheckPolicies(ReportsAction.READ_AP_AGING_SUMMARY, AbilitySubject.Report),
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

      query('aging_days_before').default(30).isNumeric().toInt(),
      query('aging_periods').default(3).isNumeric().toInt(),

      query('vendors_ids').optional().isArray({ min: 1 }),
      query('vendors_ids.*').isInt({ min: 1 }).toInt(),

      query('none_zero').default(true).isBoolean().toBoolean(),

      // Filtering by branches.
      query('branches_ids').optional().toArray().isArray({ min: 1 }),
      query('branches_ids.*').isNumeric().toInt(),
    ];
  }

  /**
   * Retrieve payable aging summary report.
   */
  async payableAgingSummary(req: Request, res: Response, next: NextFunction) {
    const { tenantId, settings } = req;
    const filter = this.matchedQueryData(req);

    try {
      const accept = this.accepts(req);
      const acceptType = accept.types(['json', 'application/json+table']);

      switch (acceptType) {
        case 'application/json+table':
          const table = await this.APAgingSummaryService.APAgingSummaryTable(
            tenantId,
            filter
          );
          return res.status(200).send({
            table: {
              rows: table.rows,
              columns: table.columns,
            },
            meta: table.meta,
            query: table.query,
          });
          break;
        default:
          const { data, columns, query, meta } =
            await this.APAgingSummaryService.APAgingSummary(tenantId, filter);

          return res.status(200).send({
            data: this.transfromToResponse(data),
            columns: this.transfromToResponse(columns),
            query: this.transfromToResponse(query),
            meta: this.transfromToResponse(meta),
          });
          break;
      }
    } catch (error) {
      next(error);
    }
  }
}
