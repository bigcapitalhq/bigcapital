import { Router, Request, Response, NextFunction } from 'express';
import { query, ValidationChain } from 'express-validator';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import BaseController from '../BaseController';
import { Inject, Service } from 'typedi';
import GeneralLedgerService from 'services/FinancialStatements/GeneralLedger/GeneralLedgerService';

@Service()
export default class GeneralLedgerReportController extends BaseController{

  @Inject()
  generalLedgetService: GeneralLedgerService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get('/', 
      this.validationSchema,
      this.validationResult,
      asyncMiddleware(this.generalLedger.bind(this))
    );
    return router;
  }

  /**
   * Validation schema.
   */
  get validationSchema(): ValidationChain[] {
    return [
      query('from_date').optional().isISO8601(),
      query('to_date').optional().isISO8601(),
      query('basis').optional(),
      query('number_format.no_cents').optional().isBoolean().toBoolean(),
      query('number_format.divide_1000').optional().isBoolean().toBoolean(),
      query('none_transactions').optional().isBoolean().toBoolean(),
      query('accounts_ids').optional(),
      query('accounts_ids.*').isNumeric().toInt(),
      query('orderBy').optional().isIn(['created_at', 'name', 'code']),
      query('order').optional().isIn(['desc', 'asc']),
    ];
  }

  /**
   * Retrieve the general ledger financial statement.
   * @param {Request} req - 
   * @param {Response} res - 
   */
  async generalLedger(req: Request, res: Response, next: NextFunction) {
    const { tenantId, settings } = req;
    const filter = this.matchedQueryData(req);

    const organizationName = settings.get({ group: 'organization', key: 'name' });
    const baseCurrency = settings.get({ group: 'organization', key: 'base_currency' });

    try {
      const {
        data,
        query,
      } = await this.generalLedgetService.generalLedger(tenantId, filter);

      return res.status(200).send({
        organization_name: organizationName,
        base_currency: baseCurrency,
        data: this.transfromToResponse(data),
        query: this.transfromToResponse(query),
      });
    } catch (error) {
      next(error);
    }
  }
}