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
import CashFlowStatementService from '@/services/FinancialStatements/CashFlow/CashFlowService';
import {
  ICashFlowStatementDOO,
  ICashFlowStatement,
  AbilitySubject,
  ReportsAction,
} from '@/interfaces';
import CashFlowTable from '@/services/FinancialStatements/CashFlow/CashFlowTable';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import CheckPolicies from '@/api/middleware/CheckPolicies';

@Service()
export default class CashFlowController extends BaseFinancialReportController {
  @Inject()
  cashFlowService: CashFlowStatementService;

  @Inject()
  tenancy: HasTenancyService;

  /**
   * Router constructor.
   */
  router() {
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
   * Balance sheet validation schema.
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

      // Filtering by branches.
      query('branches_ids').optional().toArray().isArray({ min: 1 }),
      query('branches_ids.*').isNumeric().toInt(),
    ];
  }

  /**
   * Retrieve the cashflow statement to json response.
   * @param {ICashFlowStatement} cashFlow -
   */
  private transformJsonResponse(cashFlowDOO: ICashFlowStatementDOO) {
    const { data, query, meta } = cashFlowDOO;

    return {
      data: this.transformToResponse(data),
      query: this.transformToResponse(query),
      meta: this.transformToResponse(meta),
    };
  }

  /**
   * Transforms the report statement to table rows.
   * @param {ITransactionsByVendorsStatement} statement -
   */
  private transformToTableRows(
    cashFlowDOO: ICashFlowStatementDOO,
    tenantId: number
  ) {
    const i18n = this.tenancy.i18n(tenantId);
    const cashFlowTable = new CashFlowTable(cashFlowDOO, i18n);

    return {
      table: {
        data: cashFlowTable.tableRows(),
        columns: cashFlowTable.tableColumns(),
      },
      query: this.transformToResponse(cashFlowDOO.query),
      meta: this.transformToResponse(cashFlowDOO.meta),
    };
  }

  /**
   * Retrieve the cash flow statement.
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
          return res
            .status(200)
            .send(this.transformToTableRows(cashFlow, tenantId));
        case 'json':
        default:
          return res.status(200).send(this.transformJsonResponse(cashFlow));
      }
    } catch (error) {
      next(error);
    }
  }
}
