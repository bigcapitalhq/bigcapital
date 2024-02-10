import { Inject } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { query } from 'express-validator';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import BaseFinancialReportController from '../BaseFinancialReportController';
import { AbilitySubject, ReportsAction } from '@/interfaces';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { SalesTaxLiabilitySummaryApplication } from '@/services/FinancialStatements/SalesTaxLiabilitySummary/SalesTaxLiabilitySummaryApplication';
import { ACCEPT_TYPE } from '@/interfaces/Http';

export default class SalesTaxLiabilitySummary extends BaseFinancialReportController {
  @Inject()
  private salesTaxLiabilitySummaryApp: SalesTaxLiabilitySummaryApplication;

  /**
   * Router constructor.
   */
  public router() {
    const router = Router();

    router.get(
      '/',
      CheckPolicies(
        ReportsAction.READ_SALES_TAX_LIABILITY_SUMMARY,
        AbilitySubject.Report
      ),
      this.validationSchema,
      asyncMiddleware(this.salesTaxLiabilitySummary.bind(this))
    );
    return router;
  }

  /**
   * Validation schema.
   * @returns {ValidationChain[]}
   */
  private get validationSchema() {
    return [
      query('from_date').optional().isISO8601(),
      query('to_date').optional().isISO8601(),
    ];
  }

  /*
   * Retrieves the sales tax liability summary.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  private async salesTaxLiabilitySummary(
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

      // Retrieves the json table format.
      if (acceptType === ACCEPT_TYPE.APPLICATION_JSON_TABLE) {
        const table = await this.salesTaxLiabilitySummaryApp.table(
          tenantId,
          filter
        );
        return res.status(200).send(table);
        // Retrieves the xlsx format.
      } else if (acceptType === ACCEPT_TYPE.APPLICATION_XLSX) {
        const buffer = await this.salesTaxLiabilitySummaryApp.xlsx(
          tenantId,
          filter
        );
        res.setHeader(
          'Content-Disposition',
          'attachment; filename=output.xlsx'
        );
        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        return res.send(buffer);
        // Retrieves the csv format.
      } else if (acceptType === ACCEPT_TYPE.APPLICATION_CSV) {
        const buffer = await this.salesTaxLiabilitySummaryApp.csv(
          tenantId,
          filter
        );
        res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
        res.setHeader('Content-Type', 'text/csv');

        return res.send(buffer);
        // Retrieves the json format.
      } else if (acceptType === ACCEPT_TYPE.APPLICATION_PDF) {
        const pdfContent = await this.salesTaxLiabilitySummaryApp.pdf(
          tenantId,
          filter
        );
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Length': pdfContent.length,
        });
        return res.status(200).send(pdfContent);
      } else {
        const sheet = await this.salesTaxLiabilitySummaryApp.sheet(
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
