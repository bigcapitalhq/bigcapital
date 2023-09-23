import { Router, Request, Response, NextFunction } from 'express';
import { query } from 'express-validator';
import { Inject } from 'typedi';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import BaseFinancialReportController from '../BaseFinancialReportController';
import { AbilitySubject, ReportsAction } from '@/interfaces';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { SalesTaxLiabilitySummaryService } from '@/services/FinancialStatements/SalesTaxLiabilitySummary/SalesTaxLiabilitySummaryService';

export default class SalesTaxLiabilitySummary extends BaseFinancialReportController {
  @Inject()
  private salesTaxLiabilitySummaryService: SalesTaxLiabilitySummaryService;

  /**
   * Router constructor.
   */
  router() {
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
   */
  get validationSchema() {
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
  async salesTaxLiabilitySummary(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const filter = this.matchedQueryData(req);

    try {
      const accept = this.accepts(req);
      const acceptType = accept.types(['json', 'application/json+table']);

      switch (acceptType) {
        case 'application/json+table':
          const salesTaxLiabilityTable =
            await this.salesTaxLiabilitySummaryService.salesTaxLiabilitySummaryTable(
              tenantId,
              filter
            );

          return res.status(200).send({
            table: salesTaxLiabilityTable.table,
            query: salesTaxLiabilityTable.query,
            meta: salesTaxLiabilityTable.meta,
          });
        case 'json':
        default:
          const salesTaxLiability =
            await this.salesTaxLiabilitySummaryService.salesTaxLiability(
              tenantId,
              filter
            );
          return res.status(200).send({
            data: salesTaxLiability.data,
            query: salesTaxLiability.query,
            meta: salesTaxLiability.meta,
          });
      }
    } catch (error) {
      next(error);
    }
  }
}
