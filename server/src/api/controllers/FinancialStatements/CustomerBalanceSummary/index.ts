import { Router, Request, Response, NextFunction } from 'express';
import { query } from 'express-validator';
import { Inject } from 'typedi';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import CustomerBalanceSummary from 'services/FinancialStatements/CustomerBalanceSummary/CustomerBalanceSummaryService';
import BaseFinancialReportController from '../BaseFinancialReportController';
import CustomerBalanceSummaryTableRows from 'services/FinancialStatements/CustomerBalanceSummary/CustomerBalanceSummaryTableRows';

export default class CustomerBalanceSummaryReportController extends BaseFinancialReportController {
  @Inject()
  customerBalanceSummaryService: CustomerBalanceSummary;

  @Inject()
  customerBalanceSummaryTableRows: CustomerBalanceSummaryTableRows;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/',
      this.validationSchema,
      asyncMiddleware(this.customerBalanceSummary.bind(this))
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
   * Retrieve payable aging summary report.
   * @param {Request} req - 
   * @param {Response} res - 
   * @param {NextFunction} next - 
   */
  async customerBalanceSummary(req: Request, res: Response, next: NextFunction) {
    const { tenantId, settings } = req;
    const filter = this.matchedQueryData(req);

    try {
      const {
        data,
        columns,
        query,
      } = await this.customerBalanceSummaryService.customerBalanceSummary(
        tenantId,
        filter
      );

      const tableRows = this.customerBalanceSummaryTableRows.tableRowsTransformer(
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
