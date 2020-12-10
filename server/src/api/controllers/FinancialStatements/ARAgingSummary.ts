import { Service, Inject } from 'typedi';
import { Router, Request, Response } from 'express';
import { query, oneOf } from 'express-validator';
import BaseController from '../BaseController';
import ARAgingSummaryService from 'services/FinancialStatements/AgingSummary/ARAgingSummaryService';

@Service()
export default class ARAgingSummaryReportController extends BaseController {
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
   * Receivable aging summary validation roles.
   */
  get validationSchema() {
    return [
      query('as_date').optional().isISO8601(),
      query('aging_days_before').optional().isNumeric().toInt(),
      query('aging_periods').optional().isNumeric().toInt(),
      query('number_format.no_cents').optional().isBoolean().toBoolean(),
      query('number_format.1000_divide').optional().isBoolean().toBoolean(),
      oneOf(
        [
          query('customer_ids').optional().isArray({ min: 1 }),
          query('customer_ids.*').isNumeric().toInt(),
        ],
        [query('customer_ids').optional().isNumeric().toInt()]
      ),
      query('none_zero').optional().isBoolean().toBoolean(),
    ];
  }

  /**
   * Retrieve receivable aging summary report.
   */
  async receivableAgingSummary(req: Request, res: Response) {
    const { tenantId } = req;
    const filter = this.matchedQueryData(req);

    try {
      const {
        data,
        columns
      } = await this.ARAgingSummaryService.ARAgingSummary(tenantId, filter);

      return res.status(200).send({
        data: this.transfromToResponse(data),
        columns: this.transfromToResponse(columns),
      });
    } catch (error) {
      console.log(error);
    }
  }
}
