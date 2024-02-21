import { Router, Request, Response, NextFunction } from 'express';
import { query, ValidationChain } from 'express-validator';
import { Inject, Service } from 'typedi';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import BaseFinancialReportController from './BaseFinancialReportController';
import { PurchasesByItemsService } from '@/services/FinancialStatements/PurchasesByItems/PurchasesByItemsService';
import { AbilitySubject, ReportsAction } from '@/interfaces';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { ACCEPT_TYPE } from '@/interfaces/Http';
import { PurcahsesByItemsApplication } from '@/services/FinancialStatements/PurchasesByItems/PurchasesByItemsApplication';

@Service()
export default class PurchasesByItemReportController extends BaseFinancialReportController {
  @Inject()
  private purchasesByItemsApp: PurcahsesByItemsApplication;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/',
      CheckPolicies(
        ReportsAction.READ_PURCHASES_BY_ITEMS,
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
   * @return {ValidationChain[]}
   */
  get validationSchema(): ValidationChain[] {
    return [
      query('from_date').optional().isISO8601(),
      query('to_date').optional().isISO8601(),

      // Filter items.
      query('number_format.no_cents').optional().isBoolean().toBoolean(),
      query('number_format.divide_1000').optional().isBoolean().toBoolean(),

      // Filters items.
      query('none_transactions').optional().isBoolean().toBoolean(),
      query('only_active').optional().isBoolean().toBoolean(),

      // Specific items.
      query('items_ids').optional().isArray(),
      query('items_ids.*').optional().isInt().toInt(),

      query('orderBy').optional().isIn(['created_at', 'name', 'code']),
      query('order').optional().isIn(['desc', 'asc']),
    ];
  }

  /**
   * Retrieve the general ledger financial statement.
   * @param {Request} req -
   * @param {Response} res -
   */
  public async purchasesByItems(req: Request, res: Response) {
    const { tenantId } = req;
    const filter = this.matchedQueryData(req);

    const accept = this.accepts(req);

    const acceptType = accept.types([
      ACCEPT_TYPE.APPLICATION_JSON,
      ACCEPT_TYPE.APPLICATION_JSON_TABLE,
      ACCEPT_TYPE.APPLICATION_XLSX,
      ACCEPT_TYPE.APPLICATION_CSV,
      ACCEPT_TYPE.APPLICATION_PDF,
    ]);
    // JSON table response format.
    if (ACCEPT_TYPE.APPLICATION_JSON_TABLE === acceptType) {
      const table = await this.purchasesByItemsApp.table(tenantId, filter);

      return res.status(200).send(table);
      // CSV response format.
    } else if (ACCEPT_TYPE.APPLICATION_CSV === acceptType) {
      const buffer = await this.purchasesByItemsApp.csv(tenantId, filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      return res.send(buffer);
      // Xlsx response format.
    } else if (ACCEPT_TYPE.APPLICATION_XLSX === acceptType) {
      const buffer = await this.purchasesByItemsApp.xlsx(tenantId, filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      return res.send(buffer);
      // PDF response format.
    } else if (ACCEPT_TYPE.APPLICATION_PDF === acceptType) {
      const pdfContent = await this.purchasesByItemsApp.pdf(tenantId, filter);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      return res.send(pdfContent);
      // Json response format.
    } else {
      const sheet = await this.purchasesByItemsApp.sheet(tenantId, filter);

      return res.status(200).send(sheet);
    }
  }
}
