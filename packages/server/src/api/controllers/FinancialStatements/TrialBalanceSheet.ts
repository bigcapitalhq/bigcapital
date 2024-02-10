import { Inject, Service } from 'typedi';
import { Request, Response, Router, NextFunction } from 'express';
import { query, ValidationChain } from 'express-validator';
import { castArray } from 'lodash';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import BaseFinancialReportController from './BaseFinancialReportController';
import { AbilitySubject, ReportsAction } from '@/interfaces';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { TrialBalanceSheetApplication } from '@/services/FinancialStatements/TrialBalanceSheet/TrialBalanceSheetApplication';
import { ACCEPT_TYPE } from '@/interfaces/Http';

@Service()
export default class TrialBalanceSheetController extends BaseFinancialReportController {
  @Inject()
  private trialBalanceSheetApp: TrialBalanceSheetApplication;

  /**
   * Router constructor.
   */
  public router() {
    const router = Router();

    router.get(
      '/',
      CheckPolicies(
        ReportsAction.READ_TRIAL_BALANCE_SHEET,
        AbilitySubject.Report
      ),
      this.trialBalanceSheetValidationSchema,
      this.validationResult,
      asyncMiddleware(this.trialBalanceSheet.bind(this))
    );
    return router;
  }

  /**
   * Validation schema.
   * @return {ValidationChain[]}
   */
  private get trialBalanceSheetValidationSchema(): ValidationChain[] {
    return [
      ...this.sheetNumberFormatValidationSchema,
      query('basis').optional(),
      query('from_date').optional().isISO8601(),
      query('to_date').optional().isISO8601(),
      query('account_ids').isArray().optional(),
      query('account_ids.*').isNumeric().toInt(),
      query('basis').optional(),

      query('none_zero').optional().isBoolean().toBoolean(),
      query('none_transactions').optional().isBoolean().toBoolean(),
      query('only_active').optional().isBoolean().toBoolean(),

      // Filtering by branches.
      query('branches_ids').optional().toArray().isArray({ min: 1 }),
      query('branches_ids.*').isNumeric().toInt(),
    ];
  }

  /**
   * Retrieve the trial balance sheet.
   */
  private async trialBalanceSheet(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
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
        ACCEPT_TYPE.APPLICATION_CSV,
        ACCEPT_TYPE.APPLICATION_XLSX,
        ACCEPT_TYPE.APPLICATION_PDF,
      ]);
      // Retrieves in json table format.
      if (acceptType === ACCEPT_TYPE.APPLICATION_JSON_TABLE) {
        const { table, meta, query } = await this.trialBalanceSheetApp.table(
          tenantId,
          filter
        );
        return res.status(200).send({ table, meta, query });
        // Retrieves in xlsx format
      } else if (acceptType === ACCEPT_TYPE.APPLICATION_XLSX) {
        const buffer = await this.trialBalanceSheetApp.xlsx(tenantId, filter);
        res.setHeader(
          'Content-Disposition',
          'attachment; filename=output.xlsx'
        );
        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        return res.send(buffer);
        // Retrieves in csv format.
      } else if (acceptType === ACCEPT_TYPE.APPLICATION_CSV) {
        const buffer = await this.trialBalanceSheetApp.csv(tenantId, filter);

        res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
        res.setHeader('Content-Type', 'text/csv');

        return res.send(buffer);
        // Retrieves in pdf format.
      } else if (acceptType === ACCEPT_TYPE.APPLICATION_PDF) {
        const pdfContent = await this.trialBalanceSheetApp.pdf(
          tenantId,
          filter
        );
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Length': pdfContent.length,
        });
        res.send(pdfContent);
        // Retrieves in json format.
      } else {
        const { data, query, meta } = await this.trialBalanceSheetApp.sheet(
          tenantId,
          filter
        );
        return res.status(200).send({ data, query, meta });
      }
    } catch (error) {
      next(error);
    }
  }
}
