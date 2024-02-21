import { Router, Request, Response, NextFunction } from 'express';
import { query } from 'express-validator';
import { Inject, Service } from 'typedi';
import { AbilitySubject, ReportsAction } from '@/interfaces';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import BaseFinancialReportController from '../BaseFinancialReportController';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { TransactionsByCustomerApplication } from '@/services/FinancialStatements/TransactionsByCustomer/TransactionsByCustomersApplication';
import { ACCEPT_TYPE } from '@/interfaces/Http';

@Service()
export default class TransactionsByCustomersReportController extends BaseFinancialReportController {
  @Inject()
  private transactionsByCustomersApp: TransactionsByCustomerApplication;

  /**
   * Router constructor.
   */
  public router() {
    const router = Router();

    router.get(
      '/',
      CheckPolicies(
        ReportsAction.READ_CUSTOMERS_TRANSACTIONS,
        AbilitySubject.Report
      ),
      this.validationSchema,
      this.validationResult,
      asyncMiddleware(this.transactionsByCustomers.bind(this))
    );
    return router;
  }

  /**
   * Validation schema.
   */
  private get validationSchema() {
    return [
      ...this.sheetNumberFormatValidationSchema,
      query('from_date').optional().isISO8601(),
      query('to_date').optional().isISO8601(),

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
  private async transactionsByCustomers(
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
      // Retrieves the json table format.
      if (ACCEPT_TYPE.APPLICATION_JSON_TABLE === acceptType) {
        const table = await this.transactionsByCustomersApp.table(
          tenantId,
          filter
        );
        return res.status(200).send(table);
        // Retrieve the csv format.
      } else if (ACCEPT_TYPE.APPLICATION_CSV === acceptType) {
        const csv = await this.transactionsByCustomersApp.csv(tenantId, filter);

        res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
        res.setHeader('Content-Type', 'text/csv');

        return res.send(csv);
        // Retrieve the xlsx format.
      } else if (ACCEPT_TYPE.APPLICATION_XLSX === acceptType) {
        const buffer = await this.transactionsByCustomersApp.xlsx(
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
        // Retrieve the json format.
      } else if (ACCEPT_TYPE.APPLICATION_PDF === acceptType) {
        const pdfContent = await this.transactionsByCustomersApp.pdf(
          tenantId,
          filter
        );
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Length': pdfContent.length,
        });
        return res.send(pdfContent);
      } else {
        const sheet = await this.transactionsByCustomersApp.sheet(
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
