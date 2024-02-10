import { Inject, Service } from 'typedi';
import { query } from 'express-validator';
import {
  NextFunction,
  Router,
  Request,
  Response,
  ValidationChain,
} from 'express';
import BaseFinancialReportController from '../BaseFinancialReportController';
import { AbilitySubject, ReportsAction } from '@/interfaces';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { ACCEPT_TYPE } from '@/interfaces/Http';
import { CashflowSheetApplication } from '@/services/FinancialStatements/CashFlow/CashflowSheetApplication';

@Service()
export default class CashFlowController extends BaseFinancialReportController {
  @Inject()
  private cashflowSheetApp: CashflowSheetApplication;

  /**
   * Router constructor.
   */
  public router() {
    const router = Router();

    router.get(
      '/',
      CheckPolicies(ReportsAction.READ_CASHFLOW, AbilitySubject.Report),
      this.cashflowValidationSchema,
      this.validationResult,
      this.asyncMiddleware(this.cashFlow.bind(this))
    );
    return router;
  }

  /**
   * Balance sheet validation schecma.
   * @returns {ValidationChain[]}
   */
  private get cashflowValidationSchema(): ValidationChain[] {
    return [
      ...this.sheetNumberFormatValidationSchema,
      query('from_date').optional(),
      query('to_date').optional(),

      query('display_columns_type').optional().isIn(['date_periods', 'total']),
      query('display_columns_by')
        .optional({ nullable: true, checkFalsy: true })
        .isIn(['year', 'month', 'week', 'day', 'quarter']),

      query('none_zero').optional().isBoolean().toBoolean(),
      query('none_transactions').optional().isBoolean().toBoolean(),

      // Filtering by branches.
      query('branches_ids').optional().toArray().isArray({ min: 1 }),
      query('branches_ids.*').isNumeric().toInt(),
    ];
  }

  /**
   * Retrieve the cash flow statment.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Response}
   */
  public async cashFlow(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const filter = {
      ...this.matchedQueryData(req),
    };

    try {
      const accept = this.accepts(req);

      const acceptType = accept.types([
        ACCEPT_TYPE.APPLICATION_JSON,
        ACCEPT_TYPE.APPLICATION_JSON_TABLE,
        ACCEPT_TYPE.APPLICATION_CSV,
        ACCEPT_TYPE.APPLICATION_XLSX,
        ACCEPT_TYPE.APPLICATION_PDF
      ]);
      // Retrieves the json table format.
      if (ACCEPT_TYPE.APPLICATION_JSON_TABLE === acceptType) {
        const table = await this.cashflowSheetApp.table(tenantId, filter);

        return res.status(200).send(table);
        // Retrieves the csv format.
      } else if (ACCEPT_TYPE.APPLICATION_CSV === acceptType) {
        const buffer = await this.cashflowSheetApp.csv(tenantId, filter);

        res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
        res.setHeader('Content-Type', 'text/csv');

        return res.status(200).send(buffer);
        // Retrieves the pdf format.
      } else if (ACCEPT_TYPE.APPLICATION_XLSX === acceptType) {
        const buffer = await this.cashflowSheetApp.xlsx(tenantId, filter);

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
        const pdfContent = await this.cashflowSheetApp.pdf(tenantId, filter);

        res.set({
          'Content-Type': 'application/pdf',
          'Content-Length': pdfContent.length,
        });
        return res.send(pdfContent);
        // Retrieves the json format.
      } else {
        const cashflow = await this.cashflowSheetApp.sheet(tenantId, filter);

        return res.status(200).send(cashflow);
      }
    } catch (error) {
      next(error);
    }
  }
}
