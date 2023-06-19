import { Router, Request, Response, NextFunction } from 'express';
import { query, ValidationChain } from 'express-validator';
import moment from 'moment';
import { Inject, Service } from 'typedi';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import BaseFinancialReportController from './BaseFinancialReportController';
import SalesByItemsReportService from '@/services/FinancialStatements/SalesByItems/SalesByItemsService';
import { AbilitySubject, ReportsAction } from '@/interfaces';
import CheckPolicies from '@/api/middleware/CheckPolicies';

@Service()
export default class SalesByItemsReportController extends BaseFinancialReportController {
  @Inject()
  salesByItemsService: SalesByItemsReportService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/',
      CheckPolicies(
        ReportsAction.READ_SALES_BY_ITEMS,
        AbilitySubject.Report
      ),
      this.validationSchema,
      this.validationResult,
      asyncMiddleware(this.purchasesByItems.bind(this))
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

      // Specific items.
      query('items_ids').optional().isArray(),
      query('items_ids.*').optional().isInt().toInt(),

      // Number format.
      query('number_format.no_cents').optional().isBoolean().toBoolean(),
      query('number_format.divide_1000').optional().isBoolean().toBoolean(),

      // Filters items.
      query('none_transactions').default(true).isBoolean().toBoolean(),
      query('only_active').default(false).isBoolean().toBoolean(),

      // Order by.
      query('orderBy').optional().isIn(['created_at', 'name', 'code']),
      query('order').optional().isIn(['desc', 'asc']),
    ];
  }

  /**
   * Retrieve the general ledger financial statement.
   * @param {Request} req -
   * @param {Response} res -
   */
  async purchasesByItems(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const filter = this.matchedQueryData(req);

    try {
      const { data, query, meta } = await this.salesByItemsService.salesByItems(
        tenantId,
        filter
      );
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
