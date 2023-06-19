import { Inject, Service } from 'typedi';
import { Request, Response, Router, NextFunction } from 'express';
import { check, param, query } from 'express-validator';
import BaseController from '@/api/controllers/BaseController';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import { ServiceError } from '@/exceptions';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import { DATATYPES_LENGTH } from '@/data/DataTypes';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { AbilitySubject, ManualJournalAction } from '@/interfaces';
import { ManualJournalsApplication } from '@/services/ManualJournals/ManualJournalsApplication';

@Service()
export default class ManualJournalsController extends BaseController {
  @Inject()
  private manualJournalsApplication: ManualJournalsApplication;

  @Inject()
  private dynamicListService: DynamicListingService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/',
      CheckPolicies(ManualJournalAction.View, AbilitySubject.ManualJournal),
      [...this.manualJournalsListSchema],
      this.validationResult,
      asyncMiddleware(this.getManualJournalsList),
      this.dynamicListService.handlerErrorsToResponse,
      this.catchServiceErrors
    );
    router.get(
      '/:id',
      CheckPolicies(ManualJournalAction.View, AbilitySubject.ManualJournal),
      asyncMiddleware(this.getManualJournal),
      this.catchServiceErrors
    );
    router.post(
      '/:id/publish',
      CheckPolicies(ManualJournalAction.Edit, AbilitySubject.ManualJournal),
      [...this.manualJournalParamSchema],
      this.validationResult,
      asyncMiddleware(this.publishManualJournal),
      this.catchServiceErrors
    );
    router.post(
      '/:id',
      CheckPolicies(ManualJournalAction.Edit, AbilitySubject.ManualJournal),
      [...this.manualJournalValidationSchema, ...this.manualJournalParamSchema],
      this.validationResult,
      asyncMiddleware(this.editManualJournal),
      this.catchServiceErrors
    );
    router.delete(
      '/:id',
      CheckPolicies(ManualJournalAction.Delete, AbilitySubject.ManualJournal),
      [...this.manualJournalParamSchema],
      this.validationResult,
      asyncMiddleware(this.deleteManualJournal),
      this.catchServiceErrors
    );
    router.post(
      '/',
      CheckPolicies(ManualJournalAction.Create, AbilitySubject.ManualJournal),
      [...this.manualJournalValidationSchema],
      this.validationResult,
      asyncMiddleware(this.makeJournalEntries),
      this.catchServiceErrors
    );
    return router;
  }

  /**
   * Specific manual journal id param validation schema.
   */
  get manualJournalParamSchema() {
    return [param('id').exists().isNumeric().toInt()];
  }

  /**
   * Manual journal DTO schema.
   */
  get manualJournalValidationSchema() {
    return [
      check('date').exists().isISO8601(),
      check('currency_code').optional(),
      check('exchange_rate').optional().isFloat({ gt: 0 }).toFloat(),

      check('journal_number')
        .optional()
        .isString()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.STRING }),
      check('journal_type')
        .optional({ nullable: true })
        .isString()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.STRING }),
      check('reference')
        .optional({ nullable: true })
        .isString()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.STRING }),
      check('description')
        .optional({ nullable: true })
        .isString()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.TEXT }),
      check('branch_id').optional({ nullable: true }).isNumeric().toInt(),
      check('publish').optional().isBoolean().toBoolean(),
      check('entries').isArray({ min: 2 }),
      check('entries.*.index')
        .exists()
        .isInt({ max: DATATYPES_LENGTH.INT_10 })
        .toInt(),
      check('entries.*.credit')
        .optional({ nullable: true })
        .isFloat({ min: 0, max: DATATYPES_LENGTH.DECIMAL_13_3 })
        .toFloat(),
      check('entries.*.debit')
        .optional({ nullable: true })
        .isFloat({ min: 0, max: DATATYPES_LENGTH.DECIMAL_13_3 })
        .toFloat(),
      check('entries.*.account_id')
        .isInt({ max: DATATYPES_LENGTH.INT_10 })
        .toInt(),
      check('entries.*.note')
        .optional({ nullable: true })
        .isString()
        .isLength({ max: DATATYPES_LENGTH.STRING }),
      check('entries.*.contact_id')
        .optional({ nullable: true })
        .isInt({ max: DATATYPES_LENGTH.INT_10 })
        .toInt(),
      check('entries.*.branch_id')
        .optional({ nullable: true })
        .isNumeric()
        .toInt(),
      check('entries.*.project_id')
        .optional({ nullable: true })
        .isNumeric()
        .toInt(),
    ];
  }

  /**
   * Manual journals list validation schema.
   */
  get manualJournalsListSchema() {
    return [
      query('page').optional().isNumeric().toInt(),
      query('page_size').optional().isNumeric().toInt(),
      query('custom_view_id').optional().isNumeric().toInt(),

      query('column_sort_by').optional().trim().escape(),
      query('sort_order').optional().isIn(['desc', 'asc']),

      query('stringified_filter_roles').optional().isJSON(),
      query('search_keyword').optional({ nullable: true }).isString().trim(),
    ];
  }

  /**
   * Make manual journal.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private makeJournalEntries = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId, user } = req;
    const manualJournalDTO = this.matchedBodyData(req);

    try {
      const { manualJournal } =
        await this.manualJournalsApplication.createManualJournal(
          tenantId,
          manualJournalDTO,
          user
        );
      return res.status(200).send({
        id: manualJournal.id,
        message: 'The manual journal has been created successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Edit the given manual journal.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private editManualJournal = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId, user } = req;
    const { id: manualJournalId } = req.params;
    const manualJournalDTO = this.matchedBodyData(req);

    try {
      const { manualJournal } =
        await this.manualJournalsApplication.editManualJournal(
          tenantId,
          manualJournalId,
          manualJournalDTO,
          user
        );
      return res.status(200).send({
        id: manualJournal.id,
        message: 'The manual journal has been edited successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieve the given manual journal details.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private getManualJournal = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: manualJournalId } = req.params;

    try {
      const manualJournal =
        await this.manualJournalsApplication.getManualJournal(
          tenantId,
          manualJournalId
        );
      return res.status(200).send({
        manual_journal: this.transfromToResponse(manualJournal),
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Publish the given manual journal.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private publishManualJournal = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: manualJournalId } = req.params;

    try {
      await this.manualJournalsApplication.publishManualJournal(
        tenantId,
        manualJournalId
      );
      return res.status(200).send({
        id: manualJournalId,
        message: 'The manual journal has been published successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete the given manual journal.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private deleteManualJournal = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId, user } = req;
    const { id: manualJournalId } = req.params;

    try {
      await this.manualJournalsApplication.deleteManualJournal(
        tenantId,
        manualJournalId
      );
      return res.status(200).send({
        id: manualJournalId,
        message: 'Manual journal has been deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieve manual journals list.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  getManualJournalsList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const filter = {
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      page: 1,
      pageSize: 12,
      ...this.matchedQueryData(req),
    };
    try {
      const { manualJournals, pagination, filterMeta } =
        await this.manualJournalsApplication.getManualJournals(
          tenantId,
          filter
        );

      return res.status(200).send({
        manual_journals: this.transfromToResponse(manualJournals),
        pagination: this.transfromToResponse(pagination),
        filter_meta: this.transfromToResponse(filterMeta),
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Catches all service errors.
   * @param error
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  catchServiceErrors = (
    error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (error instanceof ServiceError) {
      if (error.errorType === 'manual_journal_not_found') {
        res.boom.badRequest('Manual journal not found.', {
          errors: [{ type: 'MANUAL.JOURNAL.NOT.FOUND', code: 100 }],
        });
      }
      if (error.errorType === 'credit_debit_not_equal_zero') {
        return res.boom.badRequest(
          'Credit and debit should not be equal zero.',
          {
            errors: [
              {
                type: 'CREDIT.DEBIT.SUMMATION.SHOULD.NOT.EQUAL.ZERO',
                code: 200,
              },
            ],
          }
        );
      }
      if (error.errorType === 'credit_debit_not_equal') {
        return res.boom.badRequest('Credit and debit should be equal.', {
          errors: [{ type: 'CREDIT.DEBIT.NOT.EQUALS', code: 300 }],
        });
      }
      if (error.errorType === 'accounts_ids_not_found') {
        return res.boom.badRequest(
          'Journal entries some of accounts ids not exists.',
          { errors: [{ type: 'ACCOUNTS.IDS.NOT.FOUND', code: 400 }] }
        );
      }
      if (error.errorType === 'journal_number_exists') {
        return res.boom.badRequest('Journal number should be unique.', {
          errors: [{ type: 'JOURNAL.NUMBER.ALREADY.EXISTS', code: 500 }],
        });
      }
      if (error.errorType === 'ENTRIES_SHOULD_ASSIGN_WITH_CONTACT') {
        return res.boom.badRequest('', {
          errors: [
            {
              type: 'ENTRIES_SHOULD_ASSIGN_WITH_CONTACT',
              code: 600,
              meta: this.transfromToResponse(error.payload),
            },
          ],
        });
      }
      if (error.errorType === 'CONTACTS_SHOULD_ASSIGN_WITH_VALID_ACCOUNT') {
        return res.boom.badRequest('', {
          errors: [
            {
              type: 'CONTACTS_SHOULD_ASSIGN_WITH_VALID_ACCOUNT',
              code: 700,
              meta: this.transfromToResponse(error.payload),
            },
          ],
        });
      }
      if (error.errorType === 'contacts_not_found') {
        return res.boom.badRequest('', {
          errors: [{ type: 'CONTACTS_NOT_FOUND', code: 800 }],
        });
      }
      if (error.errorType === 'MANUAL_JOURNAL_ALREADY_PUBLISHED') {
        return res.boom.badRequest('', {
          errors: [{ type: 'MANUAL_JOURNAL_ALREADY_PUBLISHED', code: 900 }],
        });
      }
      if (error.errorType === 'MANUAL_JOURNAL_NO_REQUIRED') {
        return res.boom.badRequest('', {
          errors: [
            {
              type: 'MANUAL_JOURNAL_NO_REQUIRED',
              message: 'The manual journal number required.',
              code: 1000,
            },
          ],
        });
      }
      if (error.errorType === 'TRANSACTIONS_DATE_LOCKED') {
        return res.boom.badRequest(null, {
          errors: [
            {
              type: 'TRANSACTIONS_DATE_LOCKED',
              code: 4000,
              data: { ...error.payload },
            },
          ],
        });
      }
      if (
        error.errorType === 'COULD_NOT_ASSIGN_DIFFERENT_CURRENCY_TO_ACCOUNTS'
      ) {
        return res.boom.badRequest(null, {
          errors: [
            {
              type: 'COULD_NOT_ASSIGN_DIFFERENT_CURRENCY_TO_ACCOUNTS',
              code: 1100,
            },
          ],
        });
      }
      if (error.errorType === 'MANUAL_JOURNAL_ENTRIES_HAVE_NO_BRANCH_ID') {
        return res.boom.badRequest(null, {
          errors: [
            { type: 'MANUAL_JOURNAL_ENTRIES_HAVE_NO_BRANCH_ID', code: 1200 },
          ],
        });
      }
    }
    next(error);
  };
}
