import { Router, Request, Response, NextFunction } from 'express';
import { query } from 'express-validator';
import { Inject } from 'typedi';
import {
  AbilitySubject,
  ICustomerBalanceSummaryStatement,
  ReportsAction,
} from '@/interfaces';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import CustomerBalanceSummary from '@/services/FinancialStatements/CustomerBalanceSummary/CustomerBalanceSummaryService';
import BaseFinancialReportController from '../BaseFinancialReportController';
import CustomerBalanceSummaryTableRows from '@/services/FinancialStatements/CustomerBalanceSummary/CustomerBalanceSummaryTableRows';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import HasTenancyService from '@/services/Tenancy/TenancyService';

export default class CustomerBalanceSummaryReportController extends BaseFinancialReportController {
  @Inject()
  customerBalanceSummaryService: CustomerBalanceSummary;

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
        ReportsAction.READ_CUSTOMERS_SUMMARY_BALANCE,
        AbilitySubject.Report
      ),
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

      // Percentages.
      query('percentage_column').optional().isBoolean().toBoolean(),

      // Filters none-zero or none-transactions.
      query('none_zero').optional().isBoolean().toBoolean(),
      query('none_transactions').optional().isBoolean().toBoolean(),

      // Customers ids.
      query('customers_ids').optional().isArray({ min: 1 }),
      query('customers_ids.*').exists().isInt().toInt(),
    ];
  }

  /**
   * Transforms the balance summary statement to table rows.
   * @param {ICustomerBalanceSummaryStatement} statement -
   */
  private transformToTableRows(
    tenantId,
    { data, query }: ICustomerBalanceSummaryStatement
  ) {
    const i18n = this.tenancy.i18n(tenantId);
    const tableRows = new CustomerBalanceSummaryTableRows(data, query, i18n);

    return {
      table: {
        columns: tableRows.tableColumns(),
        data: tableRows.tableRows(),
      },
      query: this.transformToResponse(query),
    };
  }

  /**
   * Transforms the balance summary statement to raw json.
   * @param {ICustomerBalanceSummaryStatement} customerBalance -
   */
  private transformToJsonResponse({
    data,
    columns,
    query,
  }: ICustomerBalanceSummaryStatement) {
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
  async customerBalanceSummary(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId, settings } = req;
    const filter = this.matchedQueryData(req);

    try {
      const customerBalanceSummary =
        await this.customerBalanceSummaryService.customerBalanceSummary(
          tenantId,
          filter
        );
      const accept = this.accepts(req);
      const acceptType = accept.types(['json', 'application/json+table']);

      switch (acceptType) {
        case 'application/json+table':
          return res
            .status(200)
            .send(this.transformToTableRows(tenantId, customerBalanceSummary));
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
