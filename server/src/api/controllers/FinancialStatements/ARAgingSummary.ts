import { Service, Inject } from 'typedi';
import { Router, Request, Response } from 'express';
import { query } from 'express-validator';
import ARAgingSummaryService from 'services/FinancialStatements/AgingSummary/ARAgingSummaryService';
import BaseFinancialReportController from './BaseFinancialReportController';

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
    ];
  }

  /**
   * Retrieve AR aging summary report.
   */
  async receivableAgingSummary(req: Request, res: Response) {
    const { tenantId, settings } = req;
    const filter = this.matchedQueryData(req);

    try {
      const {
        data,
        columns,
        query,
        meta,
      } = await this.ARAgingSummaryService.ARAgingSummary(tenantId, filter);

      return res.status(200).send({
        data: this.transfromToResponse(data),
        columns: this.transfromToResponse(columns),
        query: this.transfromToResponse(query),
        meta: this.transfromToResponse(meta),
      });
    } catch (error) {
      console.log(error);
    }
  }
}
