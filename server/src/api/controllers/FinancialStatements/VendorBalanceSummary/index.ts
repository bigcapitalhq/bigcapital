import { Router, Request, Response, NextFunction } from 'express';
import { query } from 'express-validator';
import { Inject } from 'typedi';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import BaseFinancialReportController from '../BaseFinancialReportController';
import VendorBalanceSummaryTableRows from 'services/FinancialStatements/VendorBalanceSummary/VendorBalanceSummaryTableRows';
import VendorBalanceSummaryService from 'services/FinancialStatements/VendorBalanceSummary/VendorBalanceSummaryService';
import { IVendorBalanceSummaryStatement } from 'interfaces';
export default class VendorBalanceSummaryReportController extends BaseFinancialReportController {
  @Inject()
  vendorBalanceSummaryService: VendorBalanceSummaryService;

  @Inject()
  vendorBalanceSummaryTableRows: VendorBalanceSummaryTableRows;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/',
      this.validationSchema,
      asyncMiddleware(this.vendorBalanceSummary.bind(this))
    );
    return router;
  }

  /**
   * Validation schema.
   */
  get validationSchema() {
    return [
      ...this.sheetNumberFormatValidationSchema,
      query('as_date').optional().isISO8601(),

      // Vendors ids.
      query('vendors_ids').optional().isArray({ min: 1 }),
      query('vendors_ids.*').exists().isInt().toInt(),
    ];
  }

  /**
   * Transformes the report statement to table rows.
   * @param {IVendorBalanceSummaryStatement} statement -
   */
  transformToTableRows({ data }: IVendorBalanceSummaryStatement) {
    return {
      table: {
        data: this.vendorBalanceSummaryTableRows.tableRowsTransformer(data),
      },
    };
  }

  /**
   * Transformes the report statement to raw json.
   * @param {IVendorBalanceSummaryStatement} statement -
   */
  transformToJsonResponse({ data, columns }: IVendorBalanceSummaryStatement) {
    return {
      data: this.transfromToResponse(data),
      columns: this.transfromToResponse(columns),
      query: this.transfromToResponse(query),
    };
  }

  /**
   * Retrieve vendors balance summary.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  async vendorBalanceSummary(req: Request, res: Response, next: NextFunction) {
    const { tenantId, settings } = req;
    const filter = this.matchedQueryData(req);

    try {
      const vendorBalanceSummary = await this.vendorBalanceSummaryService.vendorBalanceSummary(
        tenantId,
        filter
      );
      const accept = this.accepts(req);
      const acceptType = accept.types(['json', 'application/json+table']);

      switch (acceptType) {
        case 'application/json+table':
          return res
            .status(200)
            .send(this.transformToTableRows(vendorBalanceSummary));
        case 'json':
        default:
          return res
            .status(200)
            .send(this.transformToJsonResponse(vendorBalanceSummary));
      }

      return res.status(200).send({});
    } catch (error) {
      next(error);
    }
  }
}
