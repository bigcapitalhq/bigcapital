import { Service, Inject } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { query, ValidationChain } from 'express-validator';
import BaseFinancialReportController from './BaseFinancialReportController';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { AbilitySubject, ReportsAction } from '@/interfaces';
import { ACCEPT_TYPE } from '@/interfaces/Http';
import { ProfitLossSheetApplication } from '@/services/FinancialStatements/ProfitLossSheet/ProfitLossSheetApplication';
@Service()
export default class ProfitLossSheetController extends BaseFinancialReportController {
  @Inject()
  private profitLossSheetApp: ProfitLossSheetApplication;

  /**
   * Router constructor.
   */
  public router() {
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
  private get validationSchema(): ValidationChain[] {
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

      // Camparsion periods periods.
      query('previous_period').optional().isBoolean().toBoolean(),
      query('previous_period_amount_change').optional().isBoolean().toBoolean(),
      query('previous_period_percentage_change')
        .optional()
        .isBoolean()
        .toBoolean(),
      // Camparsion periods periods.
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
  private async profitLossSheet(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const filter = this.matchedQueryData(req);

    const accept = this.accepts(req);

    const acceptType = accept.types([
      ACCEPT_TYPE.APPLICATION_JSON,
      ACCEPT_TYPE.APPLICATION_JSON_TABLE,
      ACCEPT_TYPE.APPLICATION_CSV,
      ACCEPT_TYPE.APPLICATION_XLSX,
      ACCEPT_TYPE.APPLICATION_PDF,
    ]);
    try {
      // Retrieves the csv format.
      if (acceptType === ACCEPT_TYPE.APPLICATION_CSV) {
        const sheet = await this.profitLossSheetApp.csv(tenantId, filter);

        res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
        res.setHeader('Content-Type', 'text/csv');

        return res.send(sheet);
        // Retrieves the json table format.
      } else if (acceptType === ACCEPT_TYPE.APPLICATION_JSON_TABLE) {
        const table = await this.profitLossSheetApp.table(tenantId, filter);

        return res.status(200).send(table);
        // Retrieves the xlsx format.
      } else if (acceptType === ACCEPT_TYPE.APPLICATION_XLSX) {
        const sheet = await this.profitLossSheetApp.xlsx(tenantId, filter);

        res.setHeader(
          'Content-Disposition',
          'attachment; filename=output.xlsx'
        );
        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        return res.send(sheet);
        // Retrieves the json format.
      } else if (acceptType === ACCEPT_TYPE.APPLICATION_PDF) {
        const pdfContent = await this.profitLossSheetApp.pdf(tenantId, filter);

        res.set({
          'Content-Type': 'application/pdf',
          'Content-Length': pdfContent.length,
        });
        return res.send(pdfContent);
      } else {
        const sheet = await this.profitLossSheetApp.sheet(tenantId, filter);

        return res.status(200).send(sheet);
      }
    } catch (error) {
      next(error);
    }
  }
}
