import { Router, Request, Response, NextFunction } from 'express';
import { query, ValidationChain } from 'express-validator';
import { Inject } from 'typedi';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import BaseFinancialReportController from '../BaseFinancialReportController';
import TransactionsByVendorsTableRows from 'services/FinancialStatements/TransactionsByVendor/TransactionsByVendorTableRows';
import TransactionsByVendorsService from 'services/FinancialStatements/TransactionsByVendor/TransactionsByVendorService';
import { ITransactionsByVendorsStatement } from 'interfaces';
export default class TransactionsByVendorsReportController extends BaseFinancialReportController {
  @Inject()
  transactionsByVendorsService: TransactionsByVendorsService;

  @Inject()
  transactionsByVendorsTableRows: TransactionsByVendorsTableRows;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/',
      this.validationSchema,
      asyncMiddleware(this.transactionsByVendors.bind(this))
    );
    return router;
  }

  /**
   * Validation schema.
   */
  get validationSchema(): ValidationChain[] {
    return [
      ...this.sheetNumberFormatValidationSchema,
      query('from_date').optional().isISO8601(),
      query('to_date').optional().isISO8601(),
      query('none_zero').optional().isBoolean().toBoolean(),
      query('none_transactions').optional().isBoolean().toBoolean(),
    ];
  }

  /**
   * Transformes the report statement to table rows.
   * @param {ITransactionsByVendorsStatement} statement -
   */
  transformToTableRows({ data }: ITransactionsByVendorsStatement) {
    return {
      table: {
        data: this.transactionsByVendorsTableRows.tableRows(data),
      },
    };
  }

  /**
   * Transformes the report statement to json response.
   * @param {ITransactionsByVendorsStatement} statement -
   */
  transformToJsonResponse({
    data,
    columns,
    query,
  }: ITransactionsByVendorsStatement) {
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
  async transactionsByVendors(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const filter = this.matchedQueryData(req);

    try {
      const transactionsByVendors = await this.transactionsByVendorsService.transactionsByVendors(
        tenantId,
        filter
      );
      const accept = this.accepts(req);
      const acceptType = accept.types(['json', 'application/json+table']);

      switch (acceptType) {
        case 'application/json+table':
          return res
            .status(200)
            .send(this.transformToTableRows(transactionsByVendors));
        case 'json':
        default:
          return res
            .status(200)
            .send(this.transformToJsonResponse(transactionsByVendors));
      }
    } catch (error) {
      next(error);
    }
  }
}
