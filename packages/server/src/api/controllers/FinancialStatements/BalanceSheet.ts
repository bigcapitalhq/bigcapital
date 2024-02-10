import { Inject, Service } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { query, ValidationChain } from 'express-validator';
import { castArray } from 'lodash';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import BaseFinancialReportController from './BaseFinancialReportController';
import { AbilitySubject, ReportsAction } from '@/interfaces';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { BalanceSheetApplication } from '@/services/FinancialStatements/BalanceSheet/BalanceSheetApplication';
import { ACCEPT_TYPE } from '@/interfaces/Http';

@Service()
export default class BalanceSheetStatementController extends BaseFinancialReportController {
  @Inject()
  private balanceSheetApp: BalanceSheetApplication;

  /**
   * Router constructor.
   */
  public router() {
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
   * Balance sheet validation schecma.
   * @returns {ValidationChain[]}
   */
  private get balanceSheetValidationSchema(): ValidationChain[] {
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
      query('branches_ids').optional().toArray().isArray({ min: 1 }),
      query('branches_ids.*').isNumeric().toInt(),
    ];
  }

  /**
   * Retrieve the balance sheet.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private async balanceSheet(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;

    let filter = this.matchedQueryData(req);

    filter = {
      ...filter,
      accountsIds: castArray(filter.accountsIds),
    };
    try {
      const accept = this.accepts(req);

      const acceptType = accept.types([
        ACCEPT_TYPE.APPLICATION_JSON,
        ACCEPT_TYPE.APPLICATION_JSON_TABLE,
        ACCEPT_TYPE.APPLICATION_XLSX,
        ACCEPT_TYPE.APPLICATION_CSV,
        ACCEPT_TYPE.APPLICATION_PDF,
      ]);
      // Retrieves the json table format.
      if (ACCEPT_TYPE.APPLICATION_JSON_TABLE == acceptType) {
        const table = await this.balanceSheetApp.table(tenantId, filter);

        return res.status(200).send(table);
        // Retrieves the csv format.
      } else if (ACCEPT_TYPE.APPLICATION_CSV === acceptType) {
        const buffer = await this.balanceSheetApp.csv(tenantId, filter);

        res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
        res.setHeader('Content-Type', 'text/csv');

        return res.send(buffer);
        // Retrieves the xlsx format.
      } else if (ACCEPT_TYPE.APPLICATION_XLSX === acceptType) {
        const buffer = await this.balanceSheetApp.xlsx(tenantId, filter);

        res.setHeader(
          'Content-Disposition',
          'attachment; filename=output.xlsx'
        );
        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        return res.send(buffer);
        // Retrieves the pdf format.
      } else if (ACCEPT_TYPE.APPLICATION_PDF === acceptType) {
        const pdfContent = await this.balanceSheetApp.pdf(tenantId, filter);

        res.set({
          'Content-Type': 'application/pdf',
          'Content-Length': pdfContent.length,
        });
        res.send(pdfContent);
      } else {
        const sheet = await this.balanceSheetApp.sheet(tenantId, filter);

        return res.status(200).send(sheet);
      }
    } catch (error) {
      next(error);
    }
  }
}
