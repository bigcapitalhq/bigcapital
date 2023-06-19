import { Service, Inject } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { query, ValidationChain } from 'express-validator';
import ProfitLossSheetService from '@/services/FinancialStatements/ProfitLossSheet/ProfitLossSheetService';
import BaseFinancialReportController from './BaseFinancialReportController';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { AbilitySubject, ReportsAction } from '@/interfaces';
import { ProfitLossSheetTable } from '@/services/FinancialStatements/ProfitLossSheet/ProfitLossSheetTable';
import HasTenancyService from '@/services/Tenancy/TenancyService';
@Service()
export default class ProfitLossSheetController extends BaseFinancialReportController {
  @Inject()
  profitLossSheetService: ProfitLossSheetService;

  @Inject()
  tenancy: HasTenancyService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/',
      CheckPolicies(ReportsAction.READ_PROFIT_LOSS, AbilitySubject.Report),
      this.validationSchema,
      this.validationResult,
      this.asyncMiddleware(this.profitLossSheet.bind(this))
    );
    return router;
  }

  /**
   * Validation schema.
   */
  get validationSchema(): ValidationChain[] {
    return [
      ...this.sheetNumberFormatValidationSchema,
      query('basis').optional(),

      query('from_date').optional().isISO8601().toDate(),
      query('to_date').optional().isISO8601().toDate(),

      query('none_zero').optional().isBoolean().toBoolean(),
      query('none_transactions').optional().isBoolean().toBoolean(),

      query('accounts_ids').isArray().optional(),
      query('accounts_ids.*').isNumeric().toInt(),

      query('display_columns_type').optional().isIn(['total', 'date_periods']),
      query('display_columns_by')
        .optional({ nullable: true, checkFalsy: true })
        .isIn(['year', 'month', 'week', 'day', 'quarter']),

      // Percentage options.
      query('percentage_column').optional().isBoolean().toBoolean(),
      query('percentage_row').optional().isBoolean().toBoolean(),
      query('percentage_expense').optional().isBoolean().toBoolean(),
      query('percentage_income').optional().isBoolean().toBoolean(),

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
      query('branches_ids').optional().isArray({ min: 1 }),
      query('branches_ids.*').isNumeric().toInt(),
    ];
  }

  /**
   * Retrieve profit/loss financial statement.
   * @param {Request} req -
   * @param {Response} res -
   */
  async profitLossSheet(req: Request, res: Response, next: NextFunction) {
    const { tenantId, settings } = req;
    const i18n = this.tenancy.i18n(tenantId);
    const filter = this.matchedQueryData(req);

    try {
      const { data, query, meta } =
        await this.profitLossSheetService.profitLossSheet(tenantId, filter);

      const accept = this.accepts(req);
      const acceptType = accept.types(['json', 'application/json+table']);

      switch (acceptType) {
        case 'application/json+table':
          const table = new ProfitLossSheetTable(data, query, i18n);

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
          return res.status(200).send({
            data,
            query,
            meta,
          });
      }
    } catch (error) {
      next(error);
    }
  }
}
