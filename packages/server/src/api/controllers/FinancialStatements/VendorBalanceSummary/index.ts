import { Router, Request, Response, NextFunction } from 'express';
import { query } from 'express-validator';
import { Inject } from 'typedi';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import BaseFinancialReportController from '../BaseFinancialReportController';
import VendorBalanceSummaryTableRows from '@/services/FinancialStatements/VendorBalanceSummary/VendorBalanceSummaryTableRows';
import VendorBalanceSummaryService from '@/services/FinancialStatements/VendorBalanceSummary/VendorBalanceSummaryService';
import {
  AbilitySubject,
  IVendorBalanceSummaryStatement,
  ReportsAction,
} from '@/interfaces';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import HasTenancyService from '@/services/Tenancy/TenancyService';

export default class VendorBalanceSummaryReportController extends BaseFinancialReportController {
  @Inject()
  vendorBalanceSummaryService: VendorBalanceSummaryService;

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
        ReportsAction.READ_VENDORS_SUMMARY_BALANCE,
        AbilitySubject.Report
      ),
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

      // Percentage columns.
      query('percentage_column').optional().isBoolean().toBoolean(),

      // Filters none-zero or none-transactions.
      query('none_zero').optional().isBoolean().toBoolean(),
      query('none_transactions').optional().isBoolean().toBoolean(),

      // Vendors ids.
      query('vendors_ids').optional().isArray({ min: 1 }),
      query('vendors_ids.*').exists().isInt().toInt(),
    ];
  }

  /**
   * Transforms the report statement to table rows.
   * @param {IVendorBalanceSummaryStatement} statement -
   */
  private transformToTableRows(
    tenantId: number,
    { data, query }: IVendorBalanceSummaryStatement
  ) {
    const i18n = this.tenancy.i18n(tenantId);
    const tableData = new VendorBalanceSummaryTableRows(
      data,
      query,
      i18n
    );
    return {
      table: {
        columns: tableData.tableColumns(),
        data: tableData.tableRows(),
      },
      query,
    };
  }

  /**
   * Transforms the report statement to raw json.
   * @param {IVendorBalanceSummaryStatement} statement -
   */
  private transformToJsonResponse({
    data,
    columns,
  }: IVendorBalanceSummaryStatement) {
    return {
      data: this.transformToResponse(data),
      columns: this.transformToResponse(columns),
      query: this.transformToResponse(query),
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
      const vendorBalanceSummary =
        await this.vendorBalanceSummaryService.vendorBalanceSummary(
          tenantId,
          filter
        );
      const accept = this.accepts(req);
      const acceptType = accept.types(['json', 'application/json+table']);

      switch (acceptType) {
        case 'application/json+table':
          return res
            .status(200)
            .send(this.transformToTableRows(tenantId, vendorBalanceSummary));
        case 'json':
        default:
          return res
            .status(200)
            .send(this.transformToJsonResponse(vendorBalanceSummary));
      }
    } catch (error) {
      next(error);
    }
  }
}
