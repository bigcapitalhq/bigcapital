import { Inject, Service } from 'typedi';
import { Request, Response, Router, NextFunction } from 'express';
import { castArray } from 'lodash';
import { query, oneOf } from 'express-validator';
import BaseFinancialReportController from './BaseFinancialReportController';
import { AbilitySubject, ReportsAction } from '@/interfaces';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { ACCEPT_TYPE } from '@/interfaces/Http';
import { JournalSheetApplication } from '@/services/FinancialStatements/JournalSheet/JournalSheetApplication';

@Service()
export default class JournalSheetController extends BaseFinancialReportController {
  @Inject()
  private journalSheetApp: JournalSheetApplication;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/',
      CheckPolicies(ReportsAction.READ_JOURNAL, AbilitySubject.Report),
      this.journalValidationSchema,
      this.validationResult,
      this.asyncMiddleware(this.journal.bind(this))
    );
    return router;
  }

  /**
   * Validation schema.
   */
  get journalValidationSchema() {
    return [
      query('from_date').optional().isISO8601(),
      query('to_date').optional().isISO8601(),
      query('transaction_type').optional().trim(),
      query('transaction_id').optional().isInt().toInt(),
      oneOf(
        [
          query('account_ids').optional().isArray({ min: 1 }),
          query('account_ids.*').optional().isNumeric().toInt(),
        ],
        [query('account_ids').optional().isNumeric().toInt()]
      ),
      query('from_range').optional().isNumeric().toInt(),
      query('to_range').optional().isNumeric().toInt(),

      query('number_format.no_cents').optional().isBoolean().toBoolean(),
      query('number_format.divide_1000').optional().isBoolean().toBoolean(),
    ];
  }

  /**
   * Retrieve the ledger report of the given account.
   * @param {Request} req -
   * @param {Response} res -
   */
  private async journal(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    let filter = this.matchedQueryData(req);

    filter = {
      ...filter,
      accountsIds: castArray(filter.accountsIds),
    };
    const accept = this.accepts(req);
    const acceptType = accept.types([
      ACCEPT_TYPE.APPLICATION_JSON,
      ACCEPT_TYPE.APPLICATION_JSON_TABLE,
      ACCEPT_TYPE.APPLICATION_XLSX,
      ACCEPT_TYPE.APPLICATION_CSV,
      ACCEPT_TYPE.APPLICATION_PDF,
    ]);

    // Retrieves the json table format.
    if (ACCEPT_TYPE.APPLICATION_JSON_TABLE === acceptType) {
      const table = await this.journalSheetApp.table(tenantId, filter);
      return res.status(200).send(table);
      // Retrieves the csv format.
    } else if (ACCEPT_TYPE.APPLICATION_CSV === acceptType) {
      const buffer = await this.journalSheetApp.csv(tenantId, filter);
  
      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      return res.send(buffer);
      // Retrieves the xlsx format.
    } else if (ACCEPT_TYPE.APPLICATION_XLSX === acceptType) {
      const buffer = await this.journalSheetApp.xlsx(tenantId, filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      return res.send(buffer);
      // Retrieves the json format.
    } else if (ACCEPT_TYPE.APPLICATION_PDF === acceptType) {
      const pdfContent = await this.journalSheetApp.pdf(tenantId, filter);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      res.send(pdfContent);
    } else {
      const sheet = await this.journalSheetApp.sheet(tenantId, filter);

      return res.status(200).send(sheet);
    }
  }
}
