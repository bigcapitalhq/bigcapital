import { Router, Request, Response, NextFunction } from 'express';
import { query, ValidationChain } from 'express-validator';
import moment from 'moment';
import { Inject, Service } from 'typedi';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import BaseFinancialReportController from './BaseFinancialReportController';
import PurchasesByItemsService from 'services/FinancialStatements/PurchasesByItems/PurchasesByItemsService';

@Service()
export default class PurchasesByItemReportController extends BaseFinancialReportController {
  @Inject()
  purchasesByItemsService: PurchasesByItemsService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/',
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
      query('number_format.no_cents').optional().isBoolean().toBoolean(),
      query('number_format.divide_1000').optional().isBoolean().toBoolean(),
      query('none_transactions').default(true).isBoolean().toBoolean(),
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
      const {
        data,
        query,
        meta, 
      } = await this.purchasesByItemsService.purchasesByItems(
        tenantId,
        filter
      );
      return res.status(200).send({
        meta: this.transfromToResponse(meta),
        data: this.transfromToResponse(data),
        query: this.transfromToResponse(query),
      });
    } catch (error) {
      next(error);
    }
  }
}
