import { Router, Request, Response, NextFunction } from 'express';
import { query } from 'express-validator';
import { Inject } from 'typedi';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import BaseFinancialReportController from '../BaseFinancialReportController';
import VendorBalanceSummaryTableRows from 'services/FinancialStatements/VendorBalanceSummary/VendorBalanceSummaryTableRows';
import VendorBalanceSummaryService from 'services/FinancialStatements/VendorBalanceSummary/VendorBalanceSummaryService';

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
    ];
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
      const {
        data,
        columns,
        query,
      } = await this.vendorBalanceSummaryService.vendorBalanceSummary(
        tenantId,
        filter
      );

      const tableRows = this.vendorBalanceSummaryTableRows.tableRowsTransformer(
        data
      );
      return res.status( 200).send({
        table: {
          rows: tableRows
        },
        columns: this.transfromToResponse(columns),
        query: this.transfromToResponse(query),
      });
    } catch (error) {
      next(error);
    }
  }
}
