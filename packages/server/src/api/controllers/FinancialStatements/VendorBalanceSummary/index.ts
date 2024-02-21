import { Router, Request, Response, NextFunction } from 'express';
import { query } from 'express-validator';
import { Inject } from 'typedi';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import BaseFinancialReportController from '../BaseFinancialReportController';
import { AbilitySubject, ReportsAction } from '@/interfaces';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { ACCEPT_TYPE } from '@/interfaces/Http';
import { VendorBalanceSummaryApplication } from '@/services/FinancialStatements/VendorBalanceSummary/VendorBalanceSummaryApplication';

export default class VendorBalanceSummaryReportController extends BaseFinancialReportController {
  @Inject()
  private vendorBalanceSummaryApp: VendorBalanceSummaryApplication;

  /**
   * Router constructor.
   */
  public router() {
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
  private get validationSchema() {
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
   * Retrieve vendors balance summary.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  public async vendorBalanceSummary(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const filter = this.matchedQueryData(req);

    try {
      const accept = this.accepts(req);
      const acceptType = accept.types([
        ACCEPT_TYPE.APPLICATION_JSON,
        ACCEPT_TYPE.APPLICATION_JSON_TABLE,
        ACCEPT_TYPE.APPLICATION_CSV,
        ACCEPT_TYPE.APPLICATION_XLSX,
        ACCEPT_TYPE.APPLICATION_PDF,
      ]);

      // Retrieves the csv format.
      if (acceptType === ACCEPT_TYPE.APPLICATION_CSV) {
        const buffer = await this.vendorBalanceSummaryApp.csv(tenantId, filter);

        res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
        res.setHeader('Content-Type', 'text/csv');

        return res.send(buffer);
      } else if (acceptType === ACCEPT_TYPE.APPLICATION_XLSX) {
        const buffer = await this.vendorBalanceSummaryApp.xlsx(
          tenantId,
          filter
        );
        res.setHeader(
          'Content-Disposition',
          'attachment; filename=output.xlsx'
        );
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        return res.send(buffer);
        // Retrieves the json table format.
      } else if (acceptType === ACCEPT_TYPE.APPLICATION_JSON_TABLE) {
        const table = await this.vendorBalanceSummaryApp.table(
          tenantId,
          filter
        );
        return res.status(200).send(table);
        // Retrieves the pdf format.
      } else if (acceptType === ACCEPT_TYPE.APPLICATION_PDF) {
        const pdfContent = await this.vendorBalanceSummaryApp.pdf(
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
        const sheet = await this.vendorBalanceSummaryApp.sheet(
          tenantId,
          filter
        );
        return res.status(200).send(sheet);
      }
    } catch (error) {
      next(error);
    }
  }
}
