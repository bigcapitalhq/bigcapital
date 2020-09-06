import { Router, Request, Response, NextFunction } from 'express';
import { check, validationResult, param, query } from 'express-validator';
import { difference } from 'lodash';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import JournalPoster from '@/services/Accounting/JournalPoster';
import {
  mapViewRolesToConditionals,
  mapFilterRolesToDynamicFilter,
} from '@/lib/ViewRolesBuilder';
import {
  DynamicFilter,
  DynamicFilterSortBy,
  DynamicFilterViews,
  DynamicFilterFilterRoles,
} from '@/lib/DynamicFilter';
import BaseController from './BaseController';
import { IAccountDTO, IAccount } from '@/interfaces';
import { ServiceError } from '@/exceptions';
import AccountsService from '@/services/Accounts/AccountsService';
import { Service, Inject } from 'typedi';

@Service()
export default class AccountsController extends BaseController{

  @Inject()
  accountsService: AccountsService;

  /**
   * Router constructor method.
   */
  router() {
    const router = Router();

    router.post(
      '/bulk/:type(activate|inactivate)',
      asyncMiddleware(this.bulkToggleActivateAccounts.bind(this))
    );
    router.post(
      '/:id/activate', [
        ...this.accountParamSchema,
      ],
      asyncMiddleware(this.activateAccount.bind(this))
    );
    router.post(
      '/:id/inactivate', [
        ...this.accountParamSchema,
      ],
      asyncMiddleware(this.inactivateAccount.bind(this))
    );
    router.post(
      '/:id', [
        ...this.accountDTOSchema,
        ...this.accountParamSchema,
      ],
      this.validationResult,
      asyncMiddleware(this.editAccount.bind(this))
    );
    router.post(
      '/', [
        ...this.accountDTOSchema,
      ],
      this.validationResult,
      asyncMiddleware(this.newAccount.bind(this))
    );
    router.get(
      '/:id', [
        ...this.accountParamSchema,
      ],
      this.validationResult,
      asyncMiddleware(this.getAccount.bind(this))
    );
    // // router.get(
    // //   '/', [
    // //     ...this.accountsListSchema
    // //   ],
    // //   asyncMiddleware(this.getAccountsList.handler)
    // // );

    router.delete(
      '/:id', [
        ...this.accountParamSchema
      ],
      this.validationResult,
      asyncMiddleware(this.deleteAccount.bind(this))
    );
    router.delete(
      '/',
      this.bulkDeleteSchema,
      asyncMiddleware(this.deleteBulkAccounts.bind(this))
    );
    
    // router.post(
    //   '/:id/recalculate-balance',
    //   this.recalcualteBalanace.validation,
    //   asyncMiddleware(this.recalcualteBalanace.handler)
    // );
    // router.post(
    //   '/:id/transfer_account/:toAccount',
    //   this.transferToAnotherAccount.validation,
    //   asyncMiddleware(this.transferToAnotherAccount.handler)
    // );
    

    return router;
  }

  /**
   * Account DTO Schema validation.
   */
  get accountDTOSchema() {
    return [
      check('name')
        .exists()
        .isLength({ min: 3, max: 255 })
        .trim()
        .escape(),
      check('code')
        .optional({ nullable: true })
        .isLength({ min: 3, max: 6 })
        .trim()
        .escape(),
      check('account_type_id')
        .exists()
        .isNumeric()
        .toInt(),
      check('description')
        .optional({ nullable: true })
        .isLength({ max: 512 })
        .trim()
        .escape(),
      check('parent_account_id')
        .optional({ nullable: true })
        .isNumeric()
        .toInt(),
    ];
  }

  /**
   * Account param schema validation.
   */
  get accountParamSchema() {
    return [
      param('id').exists().isNumeric().toInt()
    ];
  }

  /**
   * Accounts list schema validation.
   */
  get accountsListSchema() {
    return [
      query('display_type').optional().isIn(['tree', 'flat']),
      query('account_types').optional().isArray(),
      query('account_types.*').optional().isNumeric().toInt(),
      query('custom_view_id').optional().isNumeric().toInt(),

      query('stringified_filter_roles').optional().isJSON(),

      query('column_sort_by').optional(),
      query('sort_order').optional().isIn(['desc', 'asc']),
    ];
  }

  get bulkDeleteSchema() {
    return [
      query('ids').isArray({ min: 2 }),
      query('ids.*').isNumeric().toInt(),
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
      const account = await this.accountsService.newAccount(tenantId, accountDTO);

      return res.status(200).send({ id: account.id });
    } catch (error) {
      if (error instanceof ServiceError) {
        this.transformServiceErrorToResponse(res, error);
      }
      next();
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
      const account = await this.accountsService.editAccount(tenantId, accountId, accountDTO);
      return res.status(200).send({ id: account.id });

    } catch (error) {
      console.log(error);
      if (error instanceof ServiceError) {
        this.transformServiceErrorToResponse(res, error);
      }
      next();
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
      const account = await this.accountsService.getAccount(tenantId, accountId);
      return res.status(200).send({ account });

    } catch (error) {
      if (error instanceof ServiceError) {
        this.transformServiceErrorToResponse(res, error);
      }
      next();
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
      return res.status(200).send({ id: accountId });

    } catch (error) {
      console.log(error);
      if (error instanceof ServiceError) {
        this.transformServiceErrorToResponse(res, error);
        
        
      }
      next();
    }
  }

  /**
   * Activate the given account.
   * @param {Response} res - 
   * @param {Request} req - 
   * @return {Response}
   */
  async activateAccount(req: Request, res: Response, next: Function){
    const { id: accountId } = req.params;
    const { tenantId } = req;

    try {
      await this.accountsService.activateAccount(tenantId, accountId, true);
      return res.status(200).send({ id: accountId });
    } catch (error) {
      console.log(error);

      if (error instanceof ServiceError) {
        this.transformServiceErrorToResponse(res, error);
      }
      next();
    }
  }

  /**
   * Inactive the given account.
   * @param {Response} res - 
   * @param {Request} req - 
   * @return {Response}
   */
  async inactivateAccount(req: Request, res: Response, next: Function){
    const { id: accountId } = req.params;
    const { tenantId } = req;

    try {
      await this.accountsService.activateAccount(tenantId, accountId, false);
      return res.status(200).send({ id: accountId });

    } catch (error) {
      if (error instanceof ServiceError) {
        this.transformServiceErrorToResponse(res, error);
      }
      next();
    }
  }

  /**
   * Bulk activate/inactivate accounts.
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   */
  async bulkToggleActivateAccounts(req: Request, res: Response, next: Function) {
    const { type } = req.params;
    const { tenantId  } = req;
    const { ids: accountsIds } = req.query;
    
    try {
      const isActive = (type === 'activate' ? 1 : 0);
      await this.accountsService.activateAccounts(tenantId, accountsIds, isActive)
      return res.status(200).send({ ids: accountsIds });
    } catch (error) {
      if (error instanceof ServiceError) {
        this.transformServiceErrorToResponse(res, error);
      }
      next();
    }
  }

  /**
   * Deletes accounts in bulk.
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   */
  async deleteBulkAccounts(req: Request, res: Response, next: NextFunction) {
    const { ids: accountsIds } = req.query;
    const { tenantId } = req;

    try {
      await this.accountsService.deleteAccounts(tenantId, accountsIds);
      return res.status(200).send({ ids: accountsIds });

    } catch (error) {
      console.log(error);

      if (error instanceof ServiceError) {
        this.transformServiceErrorToResponse(res, error);
      }
      next();
    }
  }

  /**
   * Transforms service errors to response.
   * @param {Response} res 
   * @param {ServiceError} error 
   */ 
  transformServiceErrorToResponse(res: Response, error: ServiceError) {  
    console.log(error.errorType);
    if (error.errorType === 'account_not_found') {
      return res.boom.notFound(
        'The given account not found.', {
        errors: [{ type: 'ACCOUNT.NOT.FOUND', code: 100 }] }
      );
    }
    if (error.errorType === 'account_type_not_found') {
      return res.boom.badRequest(
        'The given account type not found.', {
        errors: [{ type: 'ACCOUNT_TYPE_NOT_FOUND', code: 200 }] }
      );
    }
    if (error.errorType === 'account_type_not_allowed_to_changed') {
      return res.boom.badRequest(
        'Not allowed to change account type of the account.',
        { errors: [{ type: 'NOT.ALLOWED.TO.CHANGE.ACCOUNT.TYPE', code: 300 }] }
      );
    }
    if (error.errorType === 'parent_account_not_found') {
      return res.boom.badRequest(
        'The parent account not found.',
        { errors: [{ type: 'PARENT_ACCOUNT_NOT_FOUND', code: 400 }] },
      );
    }
    if (error.errorType === 'parent_has_different_type') {
      return res.boom.badRequest(
        'The parent account has different type.',
        { errors: [{ type: 'PARENT.ACCOUNT.HAS.DIFFERENT.ACCOUNT.TYPE', code: 500 }] }
      );
    }
    if (error.errorType === 'account_code_not_unique') {
      return res.boom.badRequest(
        'The given account code is not unique.',
        { errors: [{ type: 'NOT_UNIQUE_CODE', code: 600 }] }
      );
    }
    if (error.errorType === 'account_has_children') {
      return res.boom.badRequest(
        'You could not delete account has children.',
        { errors: [{ type: 'ACCOUNT.HAS.CHILD.ACCOUNTS', code: 700 }] }
      );
    }
    if (error.errorType === 'account_has_associated_transactions') {
      return res.boom.badRequest(
        'You could not delete account has associated transactions.',
        { errors: [{ type: 'ACCOUNT.HAS.ASSOCIATED.TRANSACTIONS', code: 800 }] }
      );
    }
    if (error.errorType === 'account_predefined') {
      return res.boom.badRequest(
        'You could not delete predefined account',
        { errors: [{ type: 'ACCOUNT.PREDEFINED', code: 900 }] }
      );
    }
    if (error.errorType === 'accounts_not_found') {
      return res.boom.notFound(
        'Some of the given accounts not found.',
        { errors: [{ type: 'SOME.ACCOUNTS.NOT_FOUND', code: 1000 }] },
      );
    }
    if (error.errorType === 'predefined_accounts') {
      return res.boom.badRequest(
        'Some of the given accounts are predefined.',
        { errors: [{ type: 'ACCOUNTS_PREDEFINED', code: 1100 }] }
      );
    }
  }
  
 
  // /**
  //  * Retrieve accounts list.
  //  */
  // getAccountsList(req, res) {
  //   const validationErrors = validationResult(req);

  //   if (!validationErrors.isEmpty()) {
  //     return res.boom.badData(null, {
  //       code: 'validation_error',
  //       ...validationErrors,
  //     });
  //   }
  //   const filter = {
  //     display_type: 'flat',
  //     account_types: [],
  //     filter_roles: [],
  //     sort_order: 'asc',
  //     ...req.query,
  //   };
  //   if (filter.stringified_filter_roles) {
  //     filter.filter_roles = JSON.parse(filter.stringified_filter_roles);
  //   }
  //   const { Resource, Account, View } = req.models;
  //   const errorReasons = [];

  //   const accountsResource = await Resource.query()
  //     .remember()
  //     .where('name', 'accounts')
  //     .withGraphFetched('fields')
  //     .first();

  //   if (!accountsResource) {
  //     return res.status(400).send({
  //       errors: [{ type: 'ACCOUNTS_RESOURCE_NOT_FOUND', code: 200 }],
  //     });
  //   }
  //   const resourceFieldsKeys = accountsResource.fields.map((c) => c.key);

  //   const view = await View.query().onBuild((builder) => {
  //     if (filter.custom_view_id) {
  //       builder.where('id', filter.custom_view_id);
  //     } else {
  //       builder.where('favourite', true);
  //     }
  //     // builder.where('resource_id', accountsResource.id);
  //     builder.withGraphFetched('roles.field');
  //     builder.withGraphFetched('columns');
  //     builder.first();

  //     builder.remember();
  //   });
  //   const dynamicFilter = new DynamicFilter(Account.tableName);

  //   if (filter.column_sort_by) {
  //     if (resourceFieldsKeys.indexOf(filter.column_sort_by) === -1) {
  //       errorReasons.push({ type: 'COLUMN.SORT.ORDER.NOT.FOUND', code: 300 });
  //     }
  //     const sortByFilter = new DynamicFilterSortBy(
  //       filter.column_sort_by,
  //       filter.sort_order
  //     );
  //     dynamicFilter.setFilter(sortByFilter);
  //   }
  //   // View roles.
  //   if (view && view.roles.length > 0) {
  //     const viewFilter = new DynamicFilterViews(
  //       mapViewRolesToConditionals(view.roles),
  //       view.rolesLogicExpression
  //     );
  //     if (!viewFilter.validateFilterRoles()) {
  //       errorReasons.push({
  //         type: 'VIEW.LOGIC.EXPRESSION.INVALID',
  //         code: 400,
  //       });
  //     }
  //     dynamicFilter.setFilter(viewFilter);
  //   }
  //   // Filter roles.
  //   if (filter.filter_roles.length > 0) {
  //     // Validate the accounts resource fields.
  //     const filterRoles = new DynamicFilterFilterRoles(
  //       mapFilterRolesToDynamicFilter(filter.filter_roles),
  //       accountsResource.fields
  //     );
  //     dynamicFilter.setFilter(filterRoles);

  //     if (filterRoles.validateFilterRoles().length > 0) {
  //       errorReasons.push({
  //         type: 'ACCOUNTS.RESOURCE.HAS.NO.GIVEN.FIELDS',
  //         code: 500,
  //       });
  //     }
  //   }
  //   if (errorReasons.length > 0) {
  //     return res.status(400).send({ errors: errorReasons });
  //   }

  //   const accounts = await Account.query().onBuild((builder) => {
  //     builder.modify('filterAccountTypes', filter.account_types);
  //     builder.withGraphFetched('type');
  //     builder.withGraphFetched('balance');

  //     dynamicFilter.buildQuery()(builder);
  //   });
  //   return res.status(200).send({
  //     accounts:
  //       filter.display_type === 'tree'
  //         ? Account.toNestedArray(accounts)
  //         : accounts,
  //     ...(view
  //       ? {
  //           customViewId: view.id,
  //         }
  //       : {}),
  //   });
  // }

  // /**
  //  * Re-calculates balance of the given account.
  //  */
  // recalcualteBalanace: {
  //   validation: [param('id').isNumeric().toInt()],
  //   async handler(req, res) {
  //     const { id } = req.params;
  //     const { Account, AccountTransaction, AccountBalance } = req.models;
  //     const account = await Account.findById(id);

  //     if (!account) {
  //       return res.status(400).send({
  //         errors: [{ type: 'ACCOUNT.NOT.FOUND', code: 100 }],
  //       });
  //     }
  //     const accountTransactions = AccountTransaction.query().where(
  //       'account_id',
  //       account.id
  //     );

  //     const journalEntries = new JournalPoster();
  //     journalEntries.loadFromCollection(accountTransactions);

  //     // Delete the balance of the given account id.
  //     await AccountBalance.query().where('account_id', account.id).delete();

  //     // Save calcualted account balance.
  //     await journalEntries.saveBalance();

  //     return res.status(200).send();
  //   },
  // },

 

  // /**
  //  * Transfer all journal entries of the given account to another account.
  //  */
  // transferToAnotherAccount: {
  //   validation: [
  //     param('id').exists().isNumeric().toInt(),
  //     param('toAccount').exists().isNumeric().toInt(),
  //   ],
  //   async handler(req, res) {
  //     const validationErrors = validationResult(req);

  //     if (!validationErrors.isEmpty()) {
  //       return res.boom.badData(null, {
  //         code: 'validation_error',
  //         ...validationErrors,
  //       });
  //     }

  //     // const { id, toAccount: toAccountId } = req.params;

  //     // const [fromAccount, toAccount] = await Promise.all([
  //     //   Account.query().findById(id),
  //     //   Account.query().findById(toAccountId),
  //     // ]);

  //     // const fromAccountTransactions = await AccountTransaction.query()
  //     //   .where('account_id', fromAccount);

  //     // return res.status(200).send();
  //   },
  // },

  
};
