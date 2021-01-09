import { Router, Request, Response, NextFunction } from 'express';
import { query } from 'express-validator';
import { Inject } from 'typedi';
import BaseController from 'api/controllers/BaseController';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import APAgingSummaryReportService from 'services/FinancialStatements/AgingSummary/APAgingSummaryService';

export default class APAgingSummaryReportController extends BaseController {
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
      query('as_date').optional().isISO8601(),
      query('aging_days_before').optional().isNumeric().toInt(),
      query('aging_periods').optional().isNumeric().toInt(),
      query('number_format.no_cents').optional().isBoolean().toBoolean(),
      query('number_format.1000_divide').optional().isBoolean().toBoolean(),
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
      } = await this.APAgingSummaryService.APAgingSummary(tenantId, filter);

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
