import { Router, Request, Response, NextFunction } from 'express';
import { query, ValidationChain } from 'express-validator';
import { Inject, Service } from 'typedi';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import BaseFinancialReportController from './BaseFinancialReportController';
import { AbilitySubject, ReportsAction } from '@/interfaces';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { ACCEPT_TYPE } from '@/interfaces/Http';
import { GeneralLedgerApplication } from '@/services/FinancialStatements/GeneralLedger/GeneralLedgerApplication';

@Service()
export default class GeneralLedgerReportController extends BaseFinancialReportController {
  @Inject()
  private generalLedgerApplication: GeneralLedgerApplication;

  /**
   * Router constructor.
   */
  public router() {
    const router = Router();

    router.get(
      '/',
      CheckPolicies(ReportsAction.READ_GENERAL_LEDGET, AbilitySubject.Report),
      this.validationSchema,
      this.validationResult,
      asyncMiddleware(this.generalLedger.bind(this))
    );
    return router;
  }

  /**
   * Validation schema.
   */
  private get validationSchema(): ValidationChain[] {
    return [
      query('from_date').optional().isISO8601(),
      query('to_date').optional().isISO8601(),

      query('basis').optional(),

      query('number_format.no_cents').optional().isBoolean().toBoolean(),
      query('number_format.divide_1000').optional().isBoolean().toBoolean(),

      query('none_transactions').default(true).isBoolean().toBoolean(),

      query('accounts_ids').optional().isArray({ min: 1 }),
      query('accounts_ids.*').isInt().toInt(),

      query('orderBy').optional().isIn(['created_at', 'name', 'code']),
      query('order').optional().isIn(['desc', 'asc']),

      // Filtering by branches.
      query('branches_ids').optional().toArray().isArray({ min: 1 }),
      query('branches_ids.*').isNumeric().toInt(),
    ];
  }

  /**
   * Retrieve the general ledger financial statement.
   * @param {Request} req -
   * @param {Response} res -
   */
  private async generalLedger(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const filter = this.matchedQueryData(req);
    const accept = this.accepts(req);

    const acceptType = accept.types([
      ACCEPT_TYPE.APPLICATION_JSON,
      ACCEPT_TYPE.APPLICATION_JSON_TABLE,
      ACCEPT_TYPE.APPLICATION_XLSX,
      ACCEPT_TYPE.APPLICATION_CSV,
      ACCEPT_TYPE.APPLICATION_PDF,
    ]);
    // Retrieves the table format.
    if (ACCEPT_TYPE.APPLICATION_JSON_TABLE === acceptType) {
      const table = await this.generalLedgerApplication.table(tenantId, filter);

      return res.status(200).send(table);
      // Retrieves the csv format.
    } else if (ACCEPT_TYPE.APPLICATION_CSV === acceptType) {
      const buffer = await this.generalLedgerApplication.csv(tenantId, filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      return res.send(buffer);
      // Retrieves the xlsx format.
    } else if (ACCEPT_TYPE.APPLICATION_XLSX === acceptType) {
      const buffer = await this.generalLedgerApplication.xlsx(tenantId, filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      return res.send(buffer);
      // Retrieves the pdf format.
    } else if (ACCEPT_TYPE.APPLICATION_PDF === acceptType) {
      const pdfContent = await this.generalLedgerApplication.pdf(
        tenantId,
        filter
      );
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      return res.send(pdfContent);
      // Retrieves the json format.
    } else {
      const sheet = await this.generalLedgerApplication.sheet(tenantId, filter);
      return res.status(200).send(sheet);
    }
  }
}
