import { Router, Request, Response, NextFunction } from 'express';
import { query, ValidationChain } from 'express-validator';
import { Inject } from 'typedi';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import BaseFinancialReportController from '../BaseFinancialReportController';
import TransactionsByVendorsTableRows from '@/services/FinancialStatements/TransactionsByVendor/TransactionsByVendorTableRows';
import TransactionsByVendorsService from '@/services/FinancialStatements/TransactionsByVendor/TransactionsByVendorService';
import {
  AbilitySubject,
  ITransactionsByVendorsStatement,
  ReportsAction,
} from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import CheckPolicies from '@/api/middleware/CheckPolicies';

export default class TransactionsByVendorsReportController extends BaseFinancialReportController {
  @Inject()
  transactionsByVendorsService: TransactionsByVendorsService;

  @Inject()
  tenancy: HasTenancyService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/',
      CheckPolicies(
        ReportsAction.READ_VENDORS_TRANSACTIONS,
        AbilitySubject.Report
      ),
      this.validationSchema,
      this.validationResult,
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

      // Vendors ids.
      query('vendors_ids').optional().isArray({ min: 1 }),
      query('vendors_ids.*').exists().isInt().toInt(),
    ];
  }

  /**
   * Transforms the report statement to table rows.
   * @param {ITransactionsByVendorsStatement} statement -
   */
  private transformToTableRows(tenantId: number, transactions: any[]) {
    const i18n = this.tenancy.i18n(tenantId);
    const table = new TransactionsByVendorsTableRows(transactions, i18n);

    return {
      table: {
        data: table.tableRows(),
      },
    };
  }

  /**
   * Transforms the report statement to json response.
   * @param {ITransactionsByVendorsStatement} statement -
   */
  private transformToJsonResponse({
    data,
    columns,
    query,
  }: ITransactionsByVendorsStatement) {
    return {
      data: this.transformToResponse(data),
      columns: this.transformToResponse(columns),
      query: this.transformToResponse(query),
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
      const report =
        await this.transactionsByVendorsService.transactionsByVendors(
          tenantId,
          filter
        );
      const accept = this.accepts(req);
      const acceptType = accept.types(['json', 'application/json+table']);

      switch (acceptType) {
        case 'application/json+table':
          return res
            .status(200)
            .send(this.transformToTableRows(tenantId, report.data));
        case 'json':
        default:
          return res.status(200).send(this.transformToJsonResponse(report));
      }
    } catch (error) {
      next(error);
    }
  }
}
