import { Router, Request, Response, NextFunction } from 'express';
import { check, param, query } from 'express-validator';
import { Service, Inject } from 'typedi';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import BaseController from 'api/controllers/BaseController';
import AccountsService from 'services/Accounts/AccountsService';
import { IAccountDTO, IAccountsFilter } from 'interfaces';
import { ServiceError } from 'exceptions';
import DynamicListingService from 'services/DynamicListing/DynamicListService';
import { DATATYPES_LENGTH } from 'data/DataTypes';
import I18nService from 'services/I18n/I18nService';

@Service()
export default class AccountsController extends BaseController {
  @Inject()
  accountsService: AccountsService;

  @Inject()
  dynamicListService: DynamicListingService;

  @Inject()
  i18nService: I18nService;

  /**
   * Router constructor method.
   */
  router() {
    const router = Router();

    router.get(
      '/transactions',
      [query('account_id').optional().isInt().toInt()],
      this.asyncMiddleware(this.accountTransactions.bind(this)),
      this.catchServiceErrors
    );
    router.post(
      '/:id/activate',
      [...this.accountParamSchema],
      asyncMiddleware(this.activateAccount.bind(this)),
      this.catchServiceErrors
    );
    router.post(
      '/:id/inactivate',
      [...this.accountParamSchema],
      asyncMiddleware(this.inactivateAccount.bind(this)),
      this.catchServiceErrors
    );
    router.post(
      '/:id/close',
      [...this.accountParamSchema, ...this.closingAccountSchema],
      this.validationResult,
      asyncMiddleware(this.closeAccount.bind(this)),
      this.catchServiceErrors
    );
    router.post(
      '/:id',
      [...this.accountDTOSchema, ...this.accountParamSchema],
      this.validationResult,
      asyncMiddleware(this.editAccount.bind(this)),
      this.catchServiceErrors
    );
    router.post(
      '/',
      [...this.accountDTOSchema],
      this.validationResult,
      asyncMiddleware(this.newAccount.bind(this)),
      this.catchServiceErrors
    );
    router.get(
      '/:id',
      [...this.accountParamSchema],
      this.validationResult,
      asyncMiddleware(this.getAccount.bind(this)),
      this.catchServiceErrors
    );
    router.get(
      '/',
      [...this.accountsListSchema],
      this.validationResult,
      asyncMiddleware(this.getAccountsList.bind(this)),
      this.dynamicListService.handlerErrorsToResponse,
      this.catchServiceErrors
    );
    router.delete(
      '/:id',
      [...this.accountParamSchema],
      this.validationResult,
      asyncMiddleware(this.deleteAccount.bind(this)),
      this.catchServiceErrors
    );
    return router;
  }

  /**
   * Account DTO Schema validation.
   */
  get accountDTOSchema() {
    return [
      check('name')
        .exists()
        .isLength({ min: 3, max: DATATYPES_LENGTH.STRING })
        .trim()
        .escape(),
      check('code')
        .optional({ nullable: true })
        .isLength({ min: 3, max: 6 })
        .trim()
        .escape(),
      check('account_type')
        .exists()
        .isLength({ min: 3, max: DATATYPES_LENGTH.STRING })
        .trim()
        .escape(),
      check('description')
        .optional({ nullable: true })
        .isLength({ max: DATATYPES_LENGTH.TEXT })
        .trim()
        .escape(),
      check('parent_account_id')
        .optional({ nullable: true })
        .isInt({ min: 0, max: DATATYPES_LENGTH.INT_10 })
        .toInt(),
    ];
  }

  get accountParamSchema() {
    return [param('id').exists().isNumeric().toInt()];
  }

  /**
   * Accounts list validation schema.
   */
  get accountsListSchema() {
    return [
      query('view_slug').optional({ nullable: true }).isString().trim(),
      query('stringified_filter_roles').optional().isJSON(),

      query('column_sort_by').optional(),
      query('sort_order').optional().isIn(['desc', 'asc']),

      query('inactive_mode').optional().isBoolean().toBoolean(),
    ];
  }

  get closingAccountSchema() {
    return [
      check('to_account_id').exists().isNumeric().toInt(),
      check('delete_after_closing').exists().isBoolean(),
    ];
  }

  /**
   * Creates a new account.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  async newAccount(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const accountDTO: IAccountDTO = this.matchedBodyData(req);

    try {
      const account = await this.accountsService.newAccount(
        tenantId,
        accountDTO
      );

      return res.status(200).send({
        id: account.id,
        message: 'The account has been created successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Edit account details.
   * @param {Request} req
   * @param {Response} res
   * @return {Response}
   */
  async editAccount(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { id: accountId } = req.params;
    const accountDTO: IAccountDTO = this.matchedBodyData(req);

    try {
      const account = await this.accountsService.editAccount(
        tenantId,
        accountId,
        accountDTO
      );

      return res.status(200).send({
        id: account.id,
        message: 'The account has been edited successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get details of the given account.
   * @param {Request} req
   * @param {Response} res
   * @return {Response}
   */
  async getAccount(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { id: accountId } = req.params;

    try {
      const account = await this.accountsService.getAccount(
        tenantId,
        accountId
      );
      return res
        .status(200)
        .send({ account: this.transfromToResponse(account) });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete the given account.
   * @param {Request} req
   * @param {Response} res
   * @return {Response}
   */
  async deleteAccount(req: Request, res: Response, next: NextFunction) {
    const { id: accountId } = req.params;
    const { tenantId } = req;

    try {
      await this.accountsService.deleteAccount(tenantId, accountId);

      return res.status(200).send({
        id: accountId,
        message: 'The deleted account has been deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Activate the given account.
   * @param {Response} res -
   * @param {Request} req -
   * @return {Response}
   */
  async activateAccount(req: Request, res: Response, next: Function) {
    const { id: accountId } = req.params;
    const { tenantId } = req;

    try {
      await this.accountsService.activateAccount(tenantId, accountId, true);

      return res.status(200).send({
        id: accountId,
        message: 'The account has been activated successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Inactive the given account.
   * @param {Response} res -
   * @param {Request} req -
   * @return {Response}
   */
  async inactivateAccount(req: Request, res: Response, next: Function) {
    const { id: accountId } = req.params;
    const { tenantId } = req;

    try {
      await this.accountsService.activateAccount(tenantId, accountId, false);

      return res.status(200).send({
        id: accountId,
        message: 'The account has been inactivated successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve accounts datatable list.
   * @param {Request} req
   * @param {Response} res
   * @param {Response}
   */
  public async getAccountsList(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;

    // Filter query.
    const filter = {
      sortOrder: 'asc',
      columnSortBy: 'name',
      inactiveMode: false,
      ...this.matchedQueryData(req),
    };

    try {
      const { accounts, filterMeta } =
        await this.accountsService.getAccountsList(tenantId, filter);

      return res.status(200).send({
        accounts: this.transfromToResponse(accounts, 'accountTypeLabel', req),
        filter_meta: this.transfromToResponse(filterMeta),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Closes the given account.
   * @param {Request} req
   * @param {Response} res
   * @param next
   */
  async closeAccount(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { id: accountId } = req.params;
    const closeAccountQuery = this.matchedBodyData(req);

    try {
      await this.accountsService.closeAccount(
        tenantId,
        accountId,
        closeAccountQuery.toAccountId,
        closeAccountQuery.deleteAfterClosing
      );
      return res.status(200).send({ id: accountId });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve accounts transactions list.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Response}
   */
  async accountTransactions(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const transactionsFilter = this.matchedQueryData(req);

    try {
      const { transactions } =
        await this.accountsService.getAccountsTransactions(
          tenantId,
          transactionsFilter
        );
      return res.status(200).send({
        transactions: this.transfromToResponse(transactions),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Transforms service errors to response.
   * @param {Error}
   * @param {Request} req
   * @param {Response} res
   * @param {ServiceError} error
   */
  private catchServiceErrors(
    error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'account_not_found') {
        return res.boom.notFound('The given account not found.', {
          errors: [{ type: 'ACCOUNT.NOT.FOUND', code: 100 }],
        });
      }
      if (error.errorType === 'account_name_not_unqiue') {
        return res.boom.badRequest('The given account not unique.', {
          errors: [{ type: 'ACCOUNT.NAME.NOT.UNIQUE', code: 150 }],
        });
      }
      if (error.errorType === 'account_type_not_found') {
        return res.boom.badRequest('The given account type not found.', {
          errors: [{ type: 'ACCOUNT_TYPE_NOT_FOUND', code: 200 }],
        });
      }
      if (error.errorType === 'account_type_not_allowed_to_changed') {
        return res.boom.badRequest(
          'Not allowed to change account type of the account.',
          {
            errors: [{ type: 'NOT.ALLOWED.TO.CHANGE.ACCOUNT.TYPE', code: 300 }],
          }
        );
      }
      if (error.errorType === 'parent_account_not_found') {
        return res.boom.badRequest('The parent account not found.', {
          errors: [{ type: 'PARENT_ACCOUNT_NOT_FOUND', code: 400 }],
        });
      }
      if (error.errorType === 'parent_has_different_type') {
        return res.boom.badRequest('The parent account has different type.', {
          errors: [
            { type: 'PARENT.ACCOUNT.HAS.DIFFERENT.ACCOUNT.TYPE', code: 500 },
          ],
        });
      }
      if (error.errorType === 'account_code_not_unique') {
        return res.boom.badRequest('The given account code is not unique.', {
          errors: [{ type: 'NOT_UNIQUE_CODE', code: 600 }],
        });
      }
      if (error.errorType === 'account_has_associated_transactions') {
        return res.boom.badRequest(
          'You could not delete account has associated transactions.',
          {
            errors: [
              { type: 'ACCOUNT.HAS.ASSOCIATED.TRANSACTIONS', code: 800 },
            ],
          }
        );
      }
      if (error.errorType === 'account_predefined') {
        return res.boom.badRequest('You could not delete predefined account', {
          errors: [{ type: 'ACCOUNT.PREDEFINED', code: 900 }],
        });
      }
      if (error.errorType === 'accounts_not_found') {
        return res.boom.notFound('Some of the given accounts not found.', {
          errors: [{ type: 'SOME.ACCOUNTS.NOT_FOUND', code: 1000 }],
        });
      }
      if (error.errorType === 'predefined_accounts') {
        return res.boom.badRequest(
          'Some of the given accounts are predefined.',
          { errors: [{ type: 'ACCOUNTS_PREDEFINED', code: 1100 }] }
        );
      }
      if (error.errorType === 'close_account_and_to_account_not_same_type') {
        return res.boom.badRequest(
          'The close account has different root type with to account.',
          {
            errors: [
              {
                type: 'CLOSE_ACCOUNT_AND_TO_ACCOUNT_NOT_SAME_TYPE',
                code: 1200,
              },
            ],
          }
        );
      }
    }
    next(error);
  }
}
