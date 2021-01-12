import { Service, Inject } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { query, ValidationChain } from 'express-validator';
import ProfitLossSheetService from 'services/FinancialStatements/ProfitLossSheet/ProfitLossSheetService';
import BaseFinancialReportController from './BaseFinancialReportController';

@Service()
export default class ProfitLossSheetController extends BaseFinancialReportController {
  @Inject()
  profitLossSheetService: ProfitLossSheetService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/',
      this.validationSchema,
      this.validationResult,
      this.asyncMiddleware(this.profitLossSheet.bind(this)),
    );
    return router;
  }

  /**
   * Validation schema.
   */
  get validationSchema(): ValidationChain[] {
    return [
      ...this.sheetNumberFormatValidationSchema,
      query('basis').optional(),
      query('from_date').optional().isISO8601(),
      query('to_date').optional().isISO8601(),
      query('basis').optional(),
      query('none_zero').optional().isBoolean().toBoolean(),
      query('none_transactions').optional().isBoolean().toBoolean(),
      query('accounts_ids').isArray().optional(),
      query('accounts_ids.*').isNumeric().toInt(),
      query('display_columns_type').optional().isIn(['total', 'date_periods']),
      query('display_columns_by')
        .optional({ nullable: true, checkFalsy: true })
        .isIn(['year', 'month', 'week', 'day', 'quarter']),
    ];
  }

  /**
   * Retrieve profit/loss financial statement.
   * @param {Request} req -
   * @param {Response} res -
   */
  async profitLossSheet(req: Request, res: Response, next: NextFunction) {
    const { tenantId, settings } = req;
    const filter = this.matchedQueryData(req);

    const organizationName = settings.get({ group: 'organization', key: 'name' });
    const baseCurrency = settings.get({ group: 'organization', key: 'base_currency' });

    try {
      const {
        data,
        columns,
        query,
      } = await this.profitLossSheetService.profitLossSheet(tenantId, filter);

      return res.status(200).send({
        organization_name: organizationName,
        base_currency: baseCurrency,
        data: this.transfromToResponse(data),
        columns: this.transfromToResponse(columns),
        query: this.transfromToResponse(query),
      });
    } catch (error) {
      next(error);
    }
  }
}