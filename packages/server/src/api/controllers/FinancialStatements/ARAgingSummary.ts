import { Service, Inject } from 'typedi';
import { Router, Request, Response } from 'express';
import { query } from 'express-validator';
import ARAgingSummaryService from '@/services/FinancialStatements/AgingSummary/ARAgingSummaryService';
import BaseFinancialReportController from './BaseFinancialReportController';
import { AbilitySubject, ReportsAction } from '@/interfaces';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { ARAgingSummaryApplication } from '@/services/FinancialStatements/AgingSummary/ARAgingSummaryApplication';
import { ACCEPT_TYPE } from '@/interfaces/Http';

@Service()
export default class ARAgingSummaryReportController extends BaseFinancialReportController {
  @Inject()
  private ARAgingSummaryApp: ARAgingSummaryApplication;

  /**
   * Router constructor.
   */
  public router() {
    const router = Router();

    router.get(
      '/',
      CheckPolicies(ReportsAction.READ_AR_AGING_SUMMARY, AbilitySubject.Report),
      this.validationSchema,
      this.validationResult,
      this.asyncMiddleware(this.receivableAgingSummary.bind(this))
    );
    return router;
  }

  /**
   * AR aging summary validation roles.
   */
  private get validationSchema() {
    return [
      ...this.sheetNumberFormatValidationSchema,

      query('as_date').optional().isISO8601(),

      query('aging_days_before').default(30).isInt({ max: 500 }).toInt(),
      query('aging_periods').default(3).isInt({ max: 12 }).toInt(),

      query('customers_ids').optional().isArray({ min: 1 }),
      query('customers_ids.*').isInt({ min: 1 }).toInt(),

      query('none_zero').default(true).isBoolean().toBoolean(),

      // Filtering by branches.
      query('branches_ids').optional().toArray().isArray({ min: 1 }),
      query('branches_ids.*').isNumeric().toInt(),
    ];
  }

  /**
   * Retrieve AR aging summary report.
   * @param {Request} req
   * @param {Response} res
   */
  private async receivableAgingSummary(req: Request, res: Response) {
    const { tenantId } = req;
    const filter = this.matchedQueryData(req);

    try {
      const accept = this.accepts(req);

      const acceptType = accept.types([
        ACCEPT_TYPE.APPLICATION_JSON,
        ACCEPT_TYPE.APPLICATION_JSON_TABLE,
        ACCEPT_TYPE.APPLICATION_CSV,
        ACCEPT_TYPE.APPLICATION_XLSX,
        ACCEPT_TYPE.APPLICATION_PDF
      ]);
      // Retrieves the xlsx format.
      if (ACCEPT_TYPE.APPLICATION_XLSX === acceptType) {
        const buffer = await this.ARAgingSummaryApp.xlsx(tenantId, filter);

        res.setHeader(
          'Content-Disposition',
          'attachment; filename=output.xlsx'
        );
        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        return res.send(buffer);
        // Retrieves the table format.
      } else if (ACCEPT_TYPE.APPLICATION_JSON_TABLE === acceptType) {
        const table = await this.ARAgingSummaryApp.table(tenantId, filter);

        return res.status(200).send(table);
        // Retrieves the csv format.
      } else if (ACCEPT_TYPE.APPLICATION_CSV === acceptType) {
        const buffer = await this.ARAgingSummaryApp.csv(tenantId, filter);

        res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
        res.setHeader('Content-Type', 'text/csv');

        return res.send(buffer);
        // Retrieves the pdf format.
      } else if (ACCEPT_TYPE.APPLICATION_PDF === acceptType) {
        const pdfContent = await this.ARAgingSummaryApp.pdf(tenantId, filter);

        res.set({
          'Content-Type': 'application/pdf',
          'Content-Length': pdfContent.length,
        });
        return res.send(pdfContent);
        // Retrieves the json format.
      } else {
        const sheet = await this.ARAgingSummaryApp.sheet(tenantId, filter);

        return res.status(200).send(sheet);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
