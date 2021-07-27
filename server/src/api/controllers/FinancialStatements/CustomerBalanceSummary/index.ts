import { Router, Request, Response, NextFunction } from 'express';
import { query } from 'express-validator';
import { Inject } from 'typedi';
import { ICustomerBalanceSummaryStatement } from 'interfaces';
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
      this.validationResult,
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

      // As date.
      query('as_date').optional().isISO8601(),

      // Customers ids.
      query('customers_ids').optional().isArray({ min: 1 }),
      query('customers_ids.*').exists().isInt().toInt(),
    ];
  }

  /**
   * Transformes the balance summary statement to table rows.
   * @param {ICustomerBalanceSummaryStatement} statement -
   */
  private transformToTableRows({
    data,
    columns,
  }: ICustomerBalanceSummaryStatement) {
    return {
      table: {
        rows: this.customerBalanceSummaryTableRows.tableRowsTransformer(data),
        columns: this.transfromToResponse(columns),
      },
      query: this.transfromToResponse(query),
    };
  }

  /**
   * Transformes the balance summary statement to raw json.
   * @param {ICustomerBalanceSummaryStatement} customerBalance -
   */
  private transformToJsonResponse({
    data,
    columns,
    query,
  }: ICustomerBalanceSummaryStatement) {
    return {
      data: this.transfromToResponse(data),
      columns: this.transfromToResponse(columns),
      query: this.transfromToResponse(query),
    };
  }

  /**
   * Retrieve payable aging summary report.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  async customerBalanceSummary(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId, settings } = req;
    const filter = this.matchedQueryData(req);

    try {
      const customerBalanceSummary = await this.customerBalanceSummaryService.customerBalanceSummary(
        tenantId,
        filter
      );

      const accept = this.accepts(req);
      const acceptType = accept.types(['json', 'application/json+table']);

      switch (acceptType) {
        case 'application/json+table':
          return res
            .status(200)
            .send(this.transformToTableRows(customerBalanceSummary));
        case 'application/json':
        default:
          return res
            .status(200)
            .send(this.transformToJsonResponse(customerBalanceSummary));
      }
    } catch (error) {
      next(error);
    }
  }
}
