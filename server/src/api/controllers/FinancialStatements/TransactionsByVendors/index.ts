import { Router, Request, Response, NextFunction } from 'express';
import { query, ValidationChain } from 'express-validator';
import { Inject } from 'typedi';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import BaseFinancialReportController from '../BaseFinancialReportController';
import TransactionsByVendorsTableRows from 'services/FinancialStatements/TransactionsByVendor/TransactionsByVendorTableRows';
import TransactionsByVendorsService from 'services/FinancialStatements/TransactionsByVendor/TransactionsByVendorService';

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
   * Retrieve payable aging summary report.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  async transactionsByVendors(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const filter = this.matchedQueryData(req);

    try {
      const {
        data,
        columns,
        query,
      } = await this.transactionsByVendorsService.transactionsByVendors(
        tenantId,
        filter
      );

      return res.status(200).send({
        table: {
          rows: this.transactionsByVendorsTableRows.tableRows(data),
        },
      });

      return res.status(200).send({
        data: this.transfromToResponse(data),
        columns: this.transfromToResponse(columns),
        query: this.transfromToResponse(query),
      });
    } catch (error) {
      next(error);
    }
  }
}
