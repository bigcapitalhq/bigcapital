import { Inject, Service } from 'typedi';
import { Request, Response, Router, NextFunction } from 'express';
import { castArray } from 'lodash';
import { query, oneOf } from 'express-validator';
import BaseFinancialReportController from './BaseFinancialReportController';
import JournalSheetService from 'services/FinancialStatements/JournalSheet/JournalSheetService';

@Service()
export default class JournalSheetController extends BaseFinancialReportController {
  @Inject()
  journalService: JournalSheetService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get('/', 
      this.journalValidationSchema,
      this.validationResult,
      this.asyncMiddleware(this.journal.bind(this))
    );
    return router;
  }

  /**
   * Validation schema.
   */
  get journalValidationSchema() {
    return [
      query('from_date').optional().isISO8601(),
      query('to_date').optional().isISO8601(),
      oneOf([
        query('transaction_types').optional().isArray({ min: 1 }),
        query('transaction_types.*').optional().isNumeric().toInt(),
      ], [
        query('transaction_types').optional().trim().escape(),
      ]),
      oneOf([
        query('account_ids').optional().isArray({ min: 1 }),
        query('account_ids.*').optional().isNumeric().toInt(),
      ], [
        query('account_ids').optional().isNumeric().toInt(),
      ]),
      query('from_range').optional().isNumeric().toInt(),
      query('to_range').optional().isNumeric().toInt(),
      query('number_format.no_cents').optional().isBoolean().toBoolean(),
      query('number_format.divide_1000').optional().isBoolean().toBoolean(),
    ];
  }

  /**
   * Retrieve the ledger report of the given account.
   * @param {Request} req - 
   * @param {Response} res -
   */
  async journal(req: Request, res: Response, next: NextFunction) {
    const { tenantId, settings } = req;
    let filter = this.matchedQueryData(req);

    filter = {
      ...filter,
      accountsIds: castArray(filter.accountsIds),
    };
    const organizationName = settings.get({ group: 'organization', key: 'name' });
    const baseCurrency = settings.get({ group: 'organization', key: 'base_currency' });

    try {
      const { data, query } = await this.journalService.journalSheet(tenantId, filter);

      return res.status(200).send({
        organization_name: organizationName,
        base_currency: baseCurrency,
        data: this.transfromToResponse(data),
        query: this.transfromToResponse(query),
      });
    } catch (error) {
      next(error);
    }
  }
}