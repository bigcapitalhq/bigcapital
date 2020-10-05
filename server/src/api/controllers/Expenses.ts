import { Inject, Service } from "typedi";
import { check, param, query } from 'express-validator';
import { Router, Request, Response, NextFunction } from 'express';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import BaseController from "api/controllers/BaseController";
import ExpensesService from "services/Expenses/ExpensesService";
import { IExpenseDTO } from 'interfaces';
import { ServiceError } from "exceptions";
import DynamicListingService from 'services/DynamicListing/DynamicListService';

@Service()
export default class ExpensesController extends BaseController {
  @Inject()
  expensesService: ExpensesService;

  @Inject()
  dynamicListService: DynamicListingService;

  /**
   * Express router.
   */
  router() {
    const router = Router();

    router.post(
      '/', [
        ...this.expenseDTOSchema,
      ],
      this.validationResult,
      asyncMiddleware(this.newExpense.bind(this)),
      this.catchServiceErrors,
    );
    router.post(
      '/publish', [
        ...this.bulkSelectSchema,
      ],
      this.bulkPublishExpenses.bind(this),
      this.catchServiceErrors,
    );
    router.post(
      '/:id/publish', [
        ...this.expenseParamSchema,
      ],
      this.validationResult,
      asyncMiddleware(this.publishExpense.bind(this)),
      this.catchServiceErrors,
    );
    router.post(
      '/:id', [
      ...this.expenseDTOSchema,
      ...this.expenseParamSchema,
    ],
      this.validationResult,
      asyncMiddleware(this.editExpense.bind(this)),
      this.catchServiceErrors,
    );
    router.delete(
      '/:id', [
        ...this.expenseParamSchema,
      ],
      this.validationResult,
      asyncMiddleware(this.deleteExpense.bind(this)),
      this.catchServiceErrors,
    );
    router.delete('/', [
        ...this.bulkSelectSchema,
      ],
      this.validationResult,
      asyncMiddleware(this.bulkDeleteExpenses.bind(this)),
      this.catchServiceErrors,
    );
    router.get(
      '/', [
        ...this.expensesListSchema,
      ],
      asyncMiddleware(this.getExpensesList.bind(this)),
      this.dynamicListService.handlerErrorsToResponse,
      this.catchServiceErrors,
    );
    return router;
  }

  /**
   * Expense DTO schema.
   */
  get expenseDTOSchema() {
    return [
      check('reference_no').optional().trim().escape().isLength({ max: 255 }),
      check('payment_date').exists().isISO8601(),
      check('payment_account_id').exists().isNumeric().toInt(),
      check('description').optional(),
      check('currency_code').optional(),
      check('exchange_rate').optional().isNumeric().toFloat(),
      check('publish').optional().isBoolean().toBoolean(),

      check('categories').exists().isArray({ min: 1 }),
      check('categories.*.index').exists().isNumeric().toInt(),
      check('categories.*.expense_account_id').exists().isNumeric().toInt(),
      check('categories.*.amount')
        .optional({ nullable: true })
        .isNumeric()
        .isDecimal()
        .isFloat({ max: 9999999999.999 }) // 13, 3
        .toFloat(),
      check('categories.*.description').optional().trim().escape().isLength({
        max: 255,
      }),
    ];
  }

  /**
   * Expense param schema.
   */
  get expenseParamSchema() {
    return [
      param('id').exists().isNumeric().toInt(),
    ];
  }

  get bulkSelectSchema() {
    return [
      query('ids').isArray({ min: 1 }),
      query('ids.*').isNumeric().toInt(),
    ];
  }

  
  get expensesListSchema() {
    return [
      query('custom_view_id').optional().isNumeric().toInt(),
      query('stringified_filter_roles').optional().isJSON(),

      query('column_sort_by').optional(),
      query('sort_order').optional().isIn(['desc', 'asc']),

      query('page').optional().isNumeric().toInt(),
      query('page_size').optional().isNumeric().toInt(),
    ];
  }

  /**
   * Creates a new expense on
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   */
  async newExpense(req: Request, res: Response, next: NextFunction) {
    const expenseDTO: IExpenseDTO = this.matchedBodyData(req);
    const { tenantId, user } = req;

    try {
      const expense = await this.expensesService.newExpense(tenantId, expenseDTO, user);
      return res.status(200).send({ id: expense.id });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Edits details of the given expense.
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   */
  async editExpense(req: Request, res: Response, next: NextFunction) {
    const { id: expenseId } = req.params;
    const expenseDTO: IExpenseDTO = this.matchedBodyData(req);
    const { tenantId, user } = req;

    try {
      await this.expensesService.editExpense(tenantId, expenseId, expenseDTO, user);
      return res.status(200).send({ id: expenseId });
    } catch (error) {
      next(error)
    }
  }

  /**
   * Deletes the given expense.
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   */
  async deleteExpense(req: Request, res: Response, next: NextFunction) {
    const { tenantId, user } = req;
    const { id: expenseId } = req.params;

    try {
      await this.expensesService.deleteExpense(tenantId, expenseId, user);
      return res.status(200).send({ id: expenseId });
    } catch (error) {
      next(error)
    }
  }

  /**
   * Publishs the given expense.
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   */
  async publishExpense(req: Request, res: Response, next: NextFunction) {
    const { tenantId, user } = req;
    const { id: expenseId } = req.params;

    try {
      await this.expensesService.publishExpense(tenantId, expenseId, user)
      return res.status(200).send({  });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletes the expenses in bulk.
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   */
  async bulkDeleteExpenses(req: Request, res: Response, next: NextFunction) {
    const { tenantId, user } = req;
    const { ids: expensesIds } = req.params;

    try {
      await this.expensesService.deleteBulkExpenses(tenantId, expensesIds, user);
      return res.status(200).send({ ids: expensesIds });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Publishes the given expenses in bulk.
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   */
  async bulkPublishExpenses(req: Request, res: Response, next: NextFunction) {
    const { tenantId, user } = req;
    const { ids: expensesIds } = req.query;

    try {
      await this.expensesService.publishBulkExpenses(tenantId, expensesIds, user);
      return res.status(200).send({});
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve expneses list.
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next
   */
  async getExpensesList(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const filter = {
      filterRoles: [],
      sortOrder: 'asc',
      columnSortBy: 'created_at',
      page: 1,
      pageSize: 12,
      ...this.matchedQueryData(req),
    };
    if (filter.stringifiedFilterRoles) {
      filter.filterRoles = JSON.parse(filter.stringifiedFilterRoles);
    }

    try {
      const { expenses, pagination, filterMeta } = await this.expensesService.getExpensesList(tenantId, filter);

      return res.status(200).send({
        expenses,
        pagination: this.transfromToResponse(pagination),
        filter_meta: this.transfromToResponse(filterMeta),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Transform service errors to api response errors.
   * @param {Response} res 
   * @param {ServiceError} error 
   */
  catchServiceErrors(error: Error, req: Request, res: Response, next: NextFunction) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'expense_not_found') {
        return res.boom.badRequest(
          'Expense not found.',
          { errors: [{ type: 'EXPENSE_NOT_FOUND', code: 100 }] }
        );
      }
      if (error.errorType === 'total_amount_equals_zero') {
        return res.boom.badRequest(
          'Expense total should not equal zero.',
          { errors: [{ type: 'TOTAL.AMOUNT.EQUALS.ZERO', code: 200 }] },
        );
      }
      if (error.errorType === 'payment_account_not_found') {
        return res.boom.badRequest(
          'Payment account not found.',
          { errors: [{ type: 'PAYMENT.ACCOUNT.NOT.FOUND', code: 300 }] },
        );
      }
      if (error.errorType === 'some_expenses_not_found') {
        return res.boom.badRequest(
          'Some expense accounts not found.',
          { errors: [{ type: 'SOME.EXPENSE.ACCOUNTS.NOT.FOUND', code: 400 }] },
        );
      }
      if (error.errorType === 'payment_account_has_invalid_type') {
        return res.boom.badRequest(
          'Payment account has invalid type.',
          { errors: [{ type: 'PAYMENT.ACCOUNT.HAS.INVALID.TYPE', code: 500 }], },
        );
      }
      if (error.errorType === 'expenses_account_has_invalid_type') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'EXPENSES.ACCOUNT.HAS.INVALID.TYPE', code: 600 }]
        });
      }
    }
    next(error);
  }
}