import { Inject, Service } from 'typedi';
import { Request, Response, Router, NextFunction } from 'express';
import { castArray } from 'lodash';
import { query, oneOf } from 'express-validator';
import BaseFinancialReportController from './BaseFinancialReportController';
import JournalSheetService from '@/services/FinancialStatements/JournalSheet/JournalSheetService';
import { AbilitySubject, ReportsAction } from '@/interfaces';
import CheckPolicies from '@/api/middleware/CheckPolicies';

@Service()
export default class JournalSheetController extends BaseFinancialReportController {
  @Inject()
  journalService: JournalSheetService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/',
      CheckPolicies(ReportsAction.READ_JOURNAL, AbilitySubject.Report),
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
      query('transaction_type').optional().trim().escape(),
      query('transaction_id').optional().isInt().toInt(),
      oneOf(
        [
          query('account_ids').optional().isArray({ min: 1 }),
          query('account_ids.*').optional().isNumeric().toInt(),
        ],
        [query('account_ids').optional().isNumeric().toInt()]
      ),
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

    try {
      const { data, query, meta } = await this.journalService.journalSheet(
        tenantId,
        filter
      );

      return res.status(200).send({
        data: this.transformToResponse(data),
        query: this.transformToResponse(query),
        meta: this.transformToResponse(meta),
      });
    } catch (error) {
      next(error);
    }
  }
}
