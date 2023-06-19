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
import {
  ICashFlowStatementDOO,
  AbilitySubject,
  ReportsAction,
  IProjectProfitabilitySummaryPOJO,
} from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { ProjectProfitabilitySummaryTable } from '@/services/FinancialStatements/ProjectProfitabilitySummary/ProjectProfitabilitySummaryTable';
import { ProjectProfitabilitySummaryService } from '@/services/FinancialStatements/ProjectProfitabilitySummary/ProjectProfitabilitySummaryService';

@Service()
export default class ProjectProfitabilityController extends BaseFinancialReportController {
  @Inject()
  private projectProfitabilityService: ProjectProfitabilitySummaryService;

  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/',
      CheckPolicies(
        ReportsAction.READ_PROJECT_PROFITABILITY_SUMMARY,
        AbilitySubject.Report
      ),
      this.validationSchema,
      this.validationResult,
      this.asyncMiddleware(this.projectProfitabilitySummary.bind(this))
    );
    return router;
  }

  /**
   * Balance sheet validation schema.
   * @returns {ValidationChain[]}
   */
  get validationSchema(): ValidationChain[] {
    return [
      ...this.sheetNumberFormatValidationSchema,
      query('from_date').optional(),
      query('to_date').optional(),

      query('none_zero').optional().isBoolean().toBoolean(),
      query('none_transactions').optional().isBoolean().toBoolean(),

      // Filtering by projects.
      query('products_ids').optional().toArray().isArray({ min: 1 }),
      query('products_ids.*').isNumeric().toInt(),

      // Filtering by branches.
      query('branches_ids').optional().toArray().isArray({ min: 1 }),
      query('branches_ids.*').isNumeric().toInt(),
    ];
  }

  /**
   * Retrieve the cashflow statement to json response.
   * @param {ICashFlowStatement} cashFlow -
   */
  private transformJsonResponse(projectProfitabilityPOJO: IProjectProfitabilitySummaryPOJO) {
    const { data, query, meta } = projectProfitabilityPOJO;

    return {
      data: this.transfromToResponse(data),
      query: this.transfromToResponse(query),
      meta: this.transfromToResponse(meta),
    };
  }

  /**
   * Transformes the report statement to table rows.
   * @param {ITransactionsByVendorsStatement} statement -
   */
  private transformToTableRows(
    projectProfitabilityPOJO: IProjectProfitabilitySummaryPOJO,
    tenantId: number
  ) {
    const i18n = this.tenancy.i18n(tenantId);
    const projectProfitabilityTable = new ProjectProfitabilitySummaryTable(
      projectProfitabilityPOJO.data,
      i18n
    );

    return {
      table: {
        data: projectProfitabilityTable.tableData(),
        columns: projectProfitabilityTable.tableColumns(),
      },
      query: this.transfromToResponse(projectProfitabilityPOJO.query),
      // meta: this.transfromToResponse(cashFlowDOO.meta),
    };
  }

  /**
   * Retrieve the cash flow statement.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Response}
   */
  async projectProfitabilitySummary(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const filter = {
      ...this.matchedQueryData(req),
    };

    try {
      const projectProfitability =
        await this.projectProfitabilityService.projectProfitabilitySummary(
          tenantId,
          filter
        );
      const accept = this.accepts(req);
      const acceptType = accept.types(['json', 'application/json+table']);

      switch (acceptType) {
        case 'application/json+table':
          return res
            .status(200)
            .send(this.transformToTableRows(projectProfitability, tenantId));
        case 'json':
        default:
          return res
            .status(200)
            .send(this.transformJsonResponse(projectProfitability));
      }
    } catch (error) {
      next(error);
    }
  }
}
