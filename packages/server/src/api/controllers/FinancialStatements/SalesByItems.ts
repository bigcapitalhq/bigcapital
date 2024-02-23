import { Router, Request, Response, NextFunction } from 'express';
import { query, ValidationChain, ValidationSchema } from 'express-validator';
import { Inject, Service } from 'typedi';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import BaseFinancialReportController from './BaseFinancialReportController';
import { AbilitySubject, ReportsAction } from '@/interfaces';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { ACCEPT_TYPE } from '@/interfaces/Http';
import { SalesByItemsApplication } from '@/services/FinancialStatements/SalesByItems/SalesByItemsApplication';

@Service()
export default class SalesByItemsReportController extends BaseFinancialReportController {
  @Inject()
  private salesByItemsApp: SalesByItemsApplication;

  /**
   * Router constructor.
   */
  public router() {
    const router = Router();

    router.get(
      '/',
      CheckPolicies(ReportsAction.READ_SALES_BY_ITEMS, AbilitySubject.Report),
      this.validationSchema,
      this.validationResult,
      asyncMiddleware(this.salesByItems.bind(this))
    );
    return router;
  }

  /**
   * Validation schema.
   * @returns {ValidationChain[]}
   */
  private get validationSchema(): ValidationChain[] {
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
  private async salesByItems(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const filter = this.matchedQueryData(req);
    const accept = this.accepts(req);

    const acceptType = accept.types([
      ACCEPT_TYPE.APPLICATION_JSON,
      ACCEPT_TYPE.APPLICATION_JSON_TABLE,
      ACCEPT_TYPE.APPLICATION_CSV,
      ACCEPT_TYPE.APPLICATION_XLSX,
      ACCEPT_TYPE.APPLICATION_PDF,
    ]);
    // Retrieves the csv format.
    if (ACCEPT_TYPE.APPLICATION_CSV === acceptType) {
      const buffer = await this.salesByItemsApp.csv(tenantId, filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      return res.send(buffer);
      // Retrieves the json table format.
    } else if (ACCEPT_TYPE.APPLICATION_JSON_TABLE === acceptType) {
      const table = await this.salesByItemsApp.table(tenantId, filter);

      return res.status(200).send(table);
      // Retrieves the xlsx format.
    } else if (ACCEPT_TYPE.APPLICATION_XLSX === acceptType) {
      const buffer = this.salesByItemsApp.xlsx(tenantId, filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      return res.send(buffer);
      // Retrieves the json format.
    } else if (ACCEPT_TYPE.APPLICATION_PDF === acceptType) {
      const pdfContent = await this.salesByItemsApp.pdf(tenantId, filter);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      return res.send(pdfContent);
    } else {
      const sheet = await this.salesByItemsApp.sheet(tenantId, filter);
      return res.status(200).send(sheet);
    }
  }
}
