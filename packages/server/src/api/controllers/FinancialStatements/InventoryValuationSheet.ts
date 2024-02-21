import { Router, Request, Response, NextFunction } from 'express';
import { query, ValidationChain } from 'express-validator';
import { Inject, Service } from 'typedi';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import BaseFinancialReportController from './BaseFinancialReportController';
import { AbilitySubject, ReportsAction } from '@/interfaces';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { InventoryValuationSheetApplication } from '@/services/FinancialStatements/InventoryValuationSheet/InventoryValuationSheetApplication';
import { ACCEPT_TYPE } from '@/interfaces/Http';

@Service()
export default class InventoryValuationReportController extends BaseFinancialReportController {
  @Inject()
  private inventoryValuationApp: InventoryValuationSheetApplication;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/',
      CheckPolicies(
        ReportsAction.READ_INVENTORY_VALUATION_SUMMARY,
        AbilitySubject.Report
      ),
      this.validationSchema,
      this.validationResult,
      asyncMiddleware(this.inventoryValuation.bind(this))
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

      query('items_ids').optional().isArray(),
      query('items_ids.*').optional().isInt().toInt(),

      query('number_format.no_cents').optional().isBoolean().toBoolean(),
      query('number_format.divide_1000').optional().isBoolean().toBoolean(),

      query('none_transactions').default(true).isBoolean().toBoolean(),
      query('none_zero').default(false).isBoolean().toBoolean(),
      query('only_active').default(false).isBoolean().toBoolean(),

      query('orderBy').optional().isIn(['created_at', 'name', 'code']),
      query('order').optional().isIn(['desc', 'asc']),

      // Filtering by branches.
      query('branches_ids').optional().toArray().isArray({ min: 1 }),
      query('branches_ids.*').isNumeric().toInt(),

      // Filtering by warehouses.
      query('warehouses_ids').optional().toArray().isArray({ min: 1 }),
      query('warehouses_ids.*').isNumeric().toInt(),
    ];
  }

  /**
   * Retrieve the general ledger financial statement.
   * @param {Request} req -
   * @param {Response} res -
   */
  async inventoryValuation(req: Request, res: Response, next: NextFunction) {
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

    // Retrieves the json table format.
    if (ACCEPT_TYPE.APPLICATION_JSON_TABLE === acceptType) {
      const table = await this.inventoryValuationApp.table(tenantId, filter);

      return res.status(200).send(table);
      // Retrieves the csv format.
    } else if (ACCEPT_TYPE.APPLICATION_CSV == acceptType) {
      const buffer = await this.inventoryValuationApp.csv(tenantId, filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      return res.send(buffer);
      // Retrieves the xslx buffer format.
    } else if (ACCEPT_TYPE.APPLICATION_XLSX === acceptType) {
      const buffer = await this.inventoryValuationApp.xlsx(tenantId, filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      return res.send(buffer);
      // Retrieves the pdf format.
    } else if (ACCEPT_TYPE.APPLICATION_PDF === acceptType) {
      const pdfContent = await this.inventoryValuationApp.pdf(tenantId, filter);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      return res.status(200).send(pdfContent);
      // Retrieves the json format.
    } else {
      const { data, query, meta } = await this.inventoryValuationApp.sheet(
        tenantId,
        filter
      );
      return res.status(200).send({ meta, data, query });
    }
  }
}
