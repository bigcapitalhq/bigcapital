import { Inject, Service } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { query, ValidationChain } from 'express-validator';
import { castArray } from 'lodash';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import BalanceSheetStatementService from '@/services/FinancialStatements/BalanceSheet/BalanceSheetService';
import BaseFinancialReportController from './BaseFinancialReportController';
import { AbilitySubject, ReportsAction } from '@/interfaces';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import BalanceSheetTable from '@/services/FinancialStatements/BalanceSheet/BalanceSheetTable';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export default class BalanceSheetStatementController extends BaseFinancialReportController {
  @Inject()
  balanceSheetService: BalanceSheetStatementService;

  @Inject()
  tenancy: HasTenancyService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/',
      CheckPolicies(ReportsAction.READ_BALANCE_SHEET, AbilitySubject.Report),
      this.balanceSheetValidationSchema,
      this.validationResult,
      asyncMiddleware(this.balanceSheet.bind(this))
    );
    return router;
  }

  /**
   * Balance sheet validation schema.
   * @returns {ValidationChain[]}
   */
  get balanceSheetValidationSchema(): ValidationChain[] {
    return [
      ...this.sheetNumberFormatValidationSchema,
      query('accounting_method').optional().isIn(['cash', 'accrual']),

      query('from_date').optional(),
      query('to_date').optional(),

      query('display_columns_type').optional().isIn(['date_periods', 'total']),
      query('display_columns_by')
        .optional({ nullable: true, checkFalsy: true })
        .isIn(['year', 'month', 'week', 'day', 'quarter']),

      query('account_ids').isArray().optional(),
      query('account_ids.*').isNumeric().toInt(),

      query('none_zero').optional().isBoolean().toBoolean(),
      query('none_transactions').optional().isBoolean().toBoolean(),

      // Percentage of column/row.
      query('percentage_of_column').optional().isBoolean().toBoolean(),
      query('percentage_of_row').optional().isBoolean().toBoolean(),

      // Comparison periods periods.
      query('previous_period').optional().isBoolean().toBoolean(),
      query('previous_period_amount_change').optional().isBoolean().toBoolean(),
      query('previous_period_percentage_change')
        .optional()
        .isBoolean()
        .toBoolean(),
      // Comparison periods periods.
      query('previous_year').optional().isBoolean().toBoolean(),
      query('previous_year_amount_change').optional().isBoolean().toBoolean(),
      query('previous_year_percentage_change')
        .optional()
        .isBoolean()
        .toBoolean(),

      // Filtering by branches.
      query('branches_ids').optional().toArray().isArray({ min: 1 }),
      query('branches_ids.*').isNumeric().toInt(),
    ];
  }

  /**
   * Retrieve the balance sheet.
   */
  async balanceSheet(req: Request, res: Response, next: NextFunction) {
    const { tenantId, settings } = req;
    const i18n = this.tenancy.i18n(tenantId);

    let filter = this.matchedQueryData(req);

    filter = {
      ...filter,
      accountsIds: castArray(filter.accountsIds),
    };

    try {
      const { data, columns, query, meta } =
        await this.balanceSheetService.balanceSheet(tenantId, filter);

      const accept = this.accepts(req);
      const acceptType = accept.types(['json', 'application/json+table']);

      const table = new BalanceSheetTable(data, query, i18n);

      switch (acceptType) {
        case 'application/json+table':
          return res.status(200).send({
            table: {
              rows: table.tableRows(),
              columns: table.tableColumns(),
            },
            query,
            meta,
          });
        case 'json':
        default:
          return res.status(200).send({ data, columns, query, meta });
      }
    } catch (error) {
      next(error);
    }
  }
}
