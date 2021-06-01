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
import CashFlowStatementService from 'services/FinancialStatements/CashFlow/CashFlowService';
import { ICashFlowStatementDOO, ICashFlowStatement } from 'interfaces';
import CashFlowTable from 'services/FinancialStatements/CashFlow/CashFlowTable';

@Service()
export default class CashFlowController extends BaseFinancialReportController {
  @Inject()
  cashFlowService: CashFlowStatementService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/',
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
  get cashflowValidationSchema(): ValidationChain[] {
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
    ];
  }

  /**
   * Retrieve the cashflow statment to json response.
   * @param {ICashFlowStatement} cashFlow -
   */
  private transformJsonResponse(cashFlowDOO: ICashFlowStatementDOO) {
    const { data, query, meta } = cashFlowDOO;

    return {
      data: this.transfromToResponse(data),
      query: this.transfromToResponse(query),
      meta: this.transfromToResponse(meta),
    };
  }

  /**
   * Transformes the report statement to table rows.
   * @param {ITransactionsByVendorsStatement} statement -
   *
   */
  private transformToTableRows(cashFlowDOO: ICashFlowStatementDOO) {
    const cashFlowTable = new CashFlowTable(cashFlowDOO);

    return {
      table: {
        data: cashFlowTable.tableRows(),
        columns: cashFlowTable.tableColumns(),
      },
      query: this.transfromToResponse(cashFlowDOO.query),
      meta: this.transfromToResponse(cashFlowDOO.meta),
    };
  }

  /**
   * Retrieve the cash flow statment.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Response}
   */
  async cashFlow(req: Request, res: Response, next: NextFunction) {
    const { tenantId, settings } = req;
    const filter = {
      ...this.matchedQueryData(req),
    };

    try {
      const cashFlow = await this.cashFlowService.cashFlow(tenantId, filter);

      const accept = this.accepts(req);
      const acceptType = accept.types(['json', 'application/json+table']);

      switch (acceptType) {
        case 'application/json+table':
          return res.status(200).send(this.transformToTableRows(cashFlow));
        case 'json':
        default:
          return res.status(200).send(this.transformJsonResponse(cashFlow));
      }
    } catch (error) {
      next(error);
    }
  }
}
