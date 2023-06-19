import { Router, Request, Response, NextFunction } from 'express';
import { query, ValidationChain } from 'express-validator';
import { Inject, Service } from 'typedi';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import GeneralLedgerService from '@/services/FinancialStatements/GeneralLedger/GeneralLedgerService';
import BaseFinancialReportController from './BaseFinancialReportController';
import { AbilitySubject, ReportsAction } from '@/interfaces';
import CheckPolicies from '@/api/middleware/CheckPolicies';

@Service()
export default class GeneralLedgerReportController extends BaseFinancialReportController {
  @Inject()
  generalLedgetService: GeneralLedgerService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/',
      CheckPolicies(ReportsAction.READ_GENERAL_LEDGET, AbilitySubject.Report),
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

      query('none_transactions').default(true).isBoolean().toBoolean(),

      query('accounts_ids').optional().isArray({ min: 1 }),
      query('accounts_ids.*').isInt().toInt(),

      query('orderBy').optional().isIn(['created_at', 'name', 'code']),
      query('order').optional().isIn(['desc', 'asc']),

      // Filtering by branches.
      query('branches_ids').optional().toArray().isArray({ min: 1 }),
      query('branches_ids.*').isNumeric().toInt(),
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

    try {
      const { data, query, meta } =
        await this.generalLedgetService.generalLedger(tenantId, filter);

      return res.status(200).send({
        meta: this.transformToResponse(meta),
        data: this.transformToResponse(data),
        query: this.transformToResponse(query),
      });
    } catch (error) {
      next(error);
    }
  }
}
