import { Service, Inject } from 'typedi';
import { Router, Request, Response } from 'express';
import { castArray } from 'lodash';
import { query, oneOf } from 'express-validator';
import { IARAgingSummaryQuery } from 'interfaces';
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
      query('aging_days_before').optional().isInt({ max: 500 }).toInt(),
      query('aging_periods').optional().isInt({ max: 12 }).toInt(),
      query('number_format.no_cents').optional().isBoolean().toBoolean(),
      query('number_format.1000_divide').optional().isBoolean().toBoolean(),
      query('customers_ids').optional().isArray({ min: 1 }),
      query('customers_ids.*').isInt({ min: 1 }).toInt(),
      query('none_zero').default(true).isBoolean().toBoolean(),
    ];
  }

  /**
   * Retrieve receivable aging summary report.
   */
  async receivableAgingSummary(req: Request, res: Response) {
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
      } = await this.ARAgingSummaryService.ARAgingSummary(tenantId, filter);

      return res.status(200).send({
        organization_name: organizationName,
        base_currency: baseCurrency,
        data: this.transfromToResponse(data),
        columns: this.transfromToResponse(columns),
        query: this.transfromToResponse(query),
      });
    } catch (error) {
      console.log(error);
    }
  }
}
