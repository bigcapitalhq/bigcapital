import { Service, Inject } from 'typedi';
import { Router, Request, Response } from 'express';
import { query } from 'express-validator';
import ARAgingSummaryService from '@/services/FinancialStatements/AgingSummary/ARAgingSummaryService';
import BaseFinancialReportController from './BaseFinancialReportController';
import { AbilitySubject, ReportsAction } from '@/interfaces';
import CheckPolicies from '@/api/middleware/CheckPolicies';

@Service()
export default class ARAgingSummaryReportController extends BaseFinancialReportController {
  @Inject()
  ARAgingSummaryService: ARAgingSummaryService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/',
      CheckPolicies(ReportsAction.READ_AR_AGING_SUMMARY, AbilitySubject.Report),
      this.validationSchema,
      this.validationResult,
      this.asyncMiddleware(this.receivableAgingSummary.bind(this))
    );
    return router;
  }

  /**
   * AR aging summary validation roles.
   */
  get validationSchema() {
    return [
      ...this.sheetNumberFormatValidationSchema,

      query('as_date').optional().isISO8601(),

      query('aging_days_before').optional().isInt({ max: 500 }).toInt(),
      query('aging_periods').optional().isInt({ max: 12 }).toInt(),

      query('customers_ids').optional().isArray({ min: 1 }),
      query('customers_ids.*').isInt({ min: 1 }).toInt(),

      query('none_zero').default(true).isBoolean().toBoolean(),

      // Filtering by branches.
      query('branches_ids').optional().toArray().isArray({ min: 1 }),
      query('branches_ids.*').isNumeric().toInt(),
    ];
  }

  /**
   * Retrieve AR aging summary report.
   */
  async receivableAgingSummary(req: Request, res: Response) {
    const { tenantId, settings } = req;
    const filter = this.matchedQueryData(req);

    try {
      const { data, columns, query, meta } =
        await this.ARAgingSummaryService.ARAgingSummary(tenantId, filter);

      return res.status(200).send({
        data: this.transformToResponse(data),
        columns: this.transformToResponse(columns),
        query: this.transformToResponse(query),
        meta: this.transformToResponse(meta),
      });
    } catch (error) {
      console.log(error);
    }
  }
}
