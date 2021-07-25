import { Router, Request, Response, NextFunction } from 'express';
import { query } from 'express-validator';
import { Inject } from 'typedi';
import { ITransactionsByCustomersStatement } from 'interfaces';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import BaseFinancialReportController from '../BaseFinancialReportController';
import TransactionsByCustomersService from 'services/FinancialStatements/TransactionsByCustomer/TransactionsByCustomersService';
import TransactionsByCustomersTableRows from 'services/FinancialStatements/TransactionsByCustomer/TransactionsByCustomersTableRows';

export default class TransactionsByCustomersReportController extends BaseFinancialReportController {
  @Inject()
  transactionsByCustomersService: TransactionsByCustomersService;

  @Inject()
  transactionsByCustomersTableRows: TransactionsByCustomersTableRows;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/',
      this.validationSchema,
      this.validationResult,
      asyncMiddleware(this.transactionsByCustomers.bind(this))
    );
    return router;
  }

  /**
   * Validation schema.
   */
  private get validationSchema() {
    return [
      ...this.sheetNumberFormatValidationSchema,
      query('from_date').optional().isISO8601(),
      query('to_date').optional().isISO8601(),

      query('none_zero').optional().isBoolean().toBoolean(),
      query('none_transactions').optional().isBoolean().toBoolean(),

      // Customers ids.
      query('customers_ids').optional().isArray({ min: 1 }),
      query('customers_ids.*').exists().isInt().toInt(),
    ];
  }

  /**
   * Transformes the statement to table rows response.
   * @param {ITransactionsByCustomersStatement} statement -
   */
  private transformToTableResponse({
    data,
  }: ITransactionsByCustomersStatement) {
    return {
      table: {
        rows: this.transactionsByCustomersTableRows.tableRows(data),
      },
    };
  }

  /**
   * Transformes the statement to json response.
   * @param {ITransactionsByCustomersStatement} statement -
   */
  private transfromToJsonResponse({
    data,
    columns,
  }: ITransactionsByCustomersStatement) {
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
  async transactionsByCustomers(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const filter = this.matchedQueryData(req);

    try {
      const transactionsByCustomers =
        await this.transactionsByCustomersService.transactionsByCustomers(
          tenantId,
          filter
        );
      const accept = this.accepts(req);
      const acceptType = accept.types(['json', 'application/json+table']);

      switch (acceptType) {
        case 'json':
          return res
            .status(200)
            .send(this.transfromToJsonResponse(transactionsByCustomers));
        case 'application/json+table':
        default:
          return res
            .status(200)
            .send(this.transformToTableResponse(transactionsByCustomers));
      }
    } catch (error) {
      next(error);
    }
  }
}
