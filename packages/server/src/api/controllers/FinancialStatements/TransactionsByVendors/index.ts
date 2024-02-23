import { Router, Request, Response, NextFunction } from 'express';
import { query, ValidationChain } from 'express-validator';
import { Inject } from 'typedi';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import BaseFinancialReportController from '../BaseFinancialReportController';
import { AbilitySubject, ReportsAction } from '@/interfaces';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { ACCEPT_TYPE } from '@/interfaces/Http';
import { TransactionsByVendorApplication } from '@/services/FinancialStatements/TransactionsByVendor/TransactionsByVendorApplication';

export default class TransactionsByVendorsReportController extends BaseFinancialReportController {
  @Inject()
  private transactionsByVendorsApp: TransactionsByVendorApplication;

  /**
   * Router constructor.
   */
  public router() {
    const router = Router();

    router.get(
      '/',
      CheckPolicies(
        ReportsAction.READ_VENDORS_TRANSACTIONS,
        AbilitySubject.Report
      ),
      this.validationSchema,
      this.validationResult,
      asyncMiddleware(this.transactionsByVendors.bind(this))
    );
    return router;
  }

  /**
   * Validation schema.
   */
  private get validationSchema(): ValidationChain[] {
    return [
      ...this.sheetNumberFormatValidationSchema,

      query('from_date').optional().isISO8601(),
      query('to_date').optional().isISO8601(),

      query('none_zero').optional().isBoolean().toBoolean(),
      query('none_transactions').optional().isBoolean().toBoolean(),

      // Vendors ids.
      query('vendors_ids').optional().isArray({ min: 1 }),
      query('vendors_ids.*').exists().isInt().toInt(),
    ];
  }

  /**
   * Retrieve payable aging summary report.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  private async transactionsByVendors(
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

      // Retrieves the xlsx format.
      if (ACCEPT_TYPE.APPLICATION_XLSX === acceptType) {
        const buffer = await this.transactionsByVendorsApp.xlsx(
          tenantId,
          filter
        );
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader(
          'Content-Disposition',
          'attachment; filename=report.xlsx'
        );
        return res.send(buffer);
        // Retrieves the csv format.
      } else if (ACCEPT_TYPE.APPLICATION_CSV === acceptType) {
        const buffer = await this.transactionsByVendorsApp.csv(
          tenantId,
          filter
        );
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=report.csv');
        return res.send(buffer);
        // Retrieves the json table format.
      } else if (ACCEPT_TYPE.APPLICATION_JSON_TABLE === acceptType) {
        const table = await this.transactionsByVendorsApp.table(
          tenantId,
          filter
        );
        return res.status(200).send(table);
        // Retrieves the pdf format.
      } else if (ACCEPT_TYPE.APPLICATION_PDF === acceptType) {
        const pdfContent = await this.transactionsByVendorsApp.pdf(
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
        const sheet = await this.transactionsByVendorsApp.sheet(
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
