import { Router, Request, Response, NextFunction } from 'express';
import { query } from 'express-validator';
import { Inject } from 'typedi';
import { AbilitySubject, ReportsAction } from '@/interfaces';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import BaseFinancialReportController from '../BaseFinancialReportController';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { ACCEPT_TYPE } from '@/interfaces/Http';
import { CustomerBalanceSummaryApplication } from '@/services/FinancialStatements/CustomerBalanceSummary/CustomerBalanceSummaryApplication';

export default class CustomerBalanceSummaryReportController extends BaseFinancialReportController {
  @Inject()
  private customerBalanceSummaryApp: CustomerBalanceSummaryApplication;

  /**
   * Router constructor.
   */
  public router() {
    const router = Router();

    router.get(
      '/',
      CheckPolicies(
        ReportsAction.READ_CUSTOMERS_SUMMARY_BALANCE,
        AbilitySubject.Report
      ),
      this.validationSchema,
      this.validationResult,
      asyncMiddleware(this.customerBalanceSummary.bind(this))
    );
    return router;
  }

  /**
   * Validation schema.
   */
  private get validationSchema() {
    return [
      ...this.sheetNumberFormatValidationSchema,

      // As date.
      query('as_date').optional().isISO8601(),

      // Percentages.
      query('percentage_column').optional().isBoolean().toBoolean(),

      // Filters none-zero or none-transactions.
      query('none_zero').optional().isBoolean().toBoolean(),
      query('none_transactions').optional().isBoolean().toBoolean(),

      // Customers ids.
      query('customers_ids').optional().isArray({ min: 1 }),
      query('customers_ids.*').exists().isInt().toInt(),
    ];
  }

  /**
   * Retrieve payable aging summary report.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  private async customerBalanceSummary(
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
        const buffer = await this.customerBalanceSummaryApp.xlsx(
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
      } else if (ACCEPT_TYPE.APPLICATION_CSV === acceptType) {
        const buffer = await this.customerBalanceSummaryApp.csv(
          tenantId,
          filter
        );
        res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
        res.setHeader('Content-Type', 'text/csv');

        return res.send(buffer);
        // Retrieves the json table format.
      } else if (ACCEPT_TYPE.APPLICATION_JSON_TABLE === acceptType) {
        const table = await this.customerBalanceSummaryApp.table(
          tenantId,
          filter
        );
        return res.status(200).send(table);
        // Retrieves the pdf format.
      } else if (ACCEPT_TYPE.APPLICATION_PDF === acceptType) {
        const buffer = await this.customerBalanceSummaryApp.pdf(
          tenantId,
          filter
        );

        res.set({
          'Content-Type': 'application/pdf',
          'Content-Length': buffer.length,
        });
        return res.send(buffer);
        // Retrieves the json format.
      } else {
        const sheet = await this.customerBalanceSummaryApp.sheet(
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
