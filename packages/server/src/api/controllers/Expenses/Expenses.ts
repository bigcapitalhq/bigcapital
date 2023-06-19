import { Inject, Service } from 'typedi';
import { check, param, query } from 'express-validator';
import { Router, Request, Response, NextFunction } from 'express';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import BaseController from '@/api/controllers/BaseController';
import {
  AbilitySubject,
  ExpenseAction,
  IExpenseCreateDTO,
  IExpenseEditDTO,
} from '@/interfaces';
import { ServiceError } from '@/exceptions';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import { DATATYPES_LENGTH } from '@/data/DataTypes';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { ExpensesApplication } from '@/services/Expenses/ExpensesApplication';

@Service()
export class ExpensesController extends BaseController {
  @Inject()
  private expensesApplication: ExpensesApplication;

  @Inject()
  private dynamicListService: DynamicListingService;

  /**
   * Express router.
   */
  router() {
    const router = Router();

    router.post(
      '/',
      CheckPolicies(ExpenseAction.Create, AbilitySubject.Expense),
      [...this.expenseDTOSchema],
      this.validationResult,
      asyncMiddleware(this.newExpense.bind(this)),
      this.catchServiceErrors
    );
    router.post(
      '/:id/publish',
      CheckPolicies(ExpenseAction.Edit, AbilitySubject.Expense),
      [...this.expenseParamSchema],
      this.validationResult,
      asyncMiddleware(this.publishExpense.bind(this)),
      this.catchServiceErrors
    );
    router.post(
      '/:id',
      CheckPolicies(ExpenseAction.Edit, AbilitySubject.Expense),
      [...this.editExpenseDTOSchema, ...this.expenseParamSchema],
      this.validationResult,
      asyncMiddleware(this.editExpense.bind(this)),
      this.catchServiceErrors
    );
    router.delete(
      '/:id',
      CheckPolicies(ExpenseAction.Delete, AbilitySubject.Expense),
      [...this.expenseParamSchema],
      this.validationResult,
      asyncMiddleware(this.deleteExpense.bind(this)),
      this.catchServiceErrors
    );
    router.get(
      '/',
      CheckPolicies(ExpenseAction.View, AbilitySubject.Expense),
      [...this.expensesListSchema],
      this.validationResult,
      asyncMiddleware(this.getExpensesList.bind(this)),
      this.dynamicListService.handlerErrorsToResponse,
      this.catchServiceErrors
    );
    router.get(
      '/:id',
      CheckPolicies(ExpenseAction.View, AbilitySubject.Expense),
      [this.expenseParamSchema],
      this.validationResult,
      asyncMiddleware(this.getExpense.bind(this)),
      this.catchServiceErrors
    );
    return router;
  }

  /**
   * Expense DTO schema.
   */
  get expenseDTOSchema() {
    return [
      check('reference_no')
        .optional({ nullable: true })
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.STRING }),
      check('payment_date').exists().isISO8601().toDate(),
      check('payment_account_id')
        .exists()
        .isInt({ max: DATATYPES_LENGTH.INT_10 })
        .toInt(),
      check('description')
        .optional({ nullable: true })
        .isString()
        .isLength({ max: DATATYPES_LENGTH.TEXT }),
      check('currency_code').optional().isString().isLength({ max: 3 }),
      check('exchange_rate').optional({ nullable: true }).isNumeric().toFloat(),
      check('publish').optional().isBoolean().toBoolean(),
      check('payee_id').optional({ nullable: true }).isNumeric().toInt(),

      check('branch_id').optional({ nullable: true }).isNumeric().toInt(),

      check('categories').exists().isArray({ min: 1 }),
      check('categories.*.index')
        .exists()
        .isInt({ max: DATATYPES_LENGTH.INT_10 })
        .toInt(),
      check('categories.*.expense_account_id')
        .exists()
        .isInt({ max: DATATYPES_LENGTH.INT_10 })
        .toInt(),
      check('categories.*.amount')
        .optional({ nullable: true })
        .isFloat({ max: DATATYPES_LENGTH.DECIMAL_13_3 }) // 13, 3
        .toFloat(),
      check('categories.*.description')
        .optional()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.STRING }),
      check('categories.*.landed_cost').optional().isBoolean().toBoolean(),
      check('categories.*.project_id')
        .optional({ nullable: true })
        .isInt({ max: DATATYPES_LENGTH.INT_10 })
        .toInt(),
    ];
  }

  /**
   * Edit expense validation schema.
   */
  get editExpenseDTOSchema() {
    return [
      check('reference_no')
        .optional({ nullable: true })
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.STRING }),
      check('payment_date').exists().isISO8601().toDate(),
      check('payment_account_id')
        .exists()
        .isInt({ max: DATATYPES_LENGTH.INT_10 })
        .toInt(),
      check('description')
        .optional({ nullable: true })
        .isString()
        .isLength({ max: DATATYPES_LENGTH.TEXT }),
      check('currency_code').optional().isString().isLength({ max: 3 }),
      check('exchange_rate').optional({ nullable: true }).isNumeric().toFloat(),
      check('publish').optional().isBoolean().toBoolean(),
      check('payee_id').optional({ nullable: true }).isNumeric().toInt(),

      check('branch_id').optional({ nullable: true }).isNumeric().toInt(),

      check('categories').exists().isArray({ min: 1 }),
      check('categories.*.id').optional().isNumeric().toInt(),
      check('categories.*.index')
        .exists()
        .isInt({ max: DATATYPES_LENGTH.INT_10 })
        .toInt(),
      check('categories.*.expense_account_id')
        .exists()
        .isInt({ max: DATATYPES_LENGTH.INT_10 })
        .toInt(),
      check('categories.*.amount')
        .optional({ nullable: true })
        .isFloat({ max: DATATYPES_LENGTH.DECIMAL_13_3 }) // 13, 3
        .toFloat(),
      check('categories.*.description')
        .optional()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.STRING }),
      check('categories.*.landed_cost').optional().isBoolean().toBoolean(),
      check('categories.*.project_id')
        .optional({ nullable: true })
        .isInt({ max: DATATYPES_LENGTH.INT_10 })
        .toInt(),
    ];
  }

  /**
   * Expense param validation schema.
   */
  get expenseParamSchema() {
    return [param('id').exists().isNumeric().toInt()];
  }

  /**
   * Expenses list validation schema.
   */
  get expensesListSchema() {
    return [
      query('view_slug').optional({ nullable: true }).isString().trim(),
      query('stringified_filter_roles').optional().isJSON(),

      query('column_sort_by').optional(),
      query('sort_order').optional().isIn(['desc', 'asc']),

      query('page').optional().isNumeric().toInt(),
      query('page_size').optional().isNumeric().toInt(),

      query('search_keyword').optional({ nullable: true }).isString().trim(),
    ];
  }

  /**
   * Creates a new expense on
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async newExpense(req: Request, res: Response, next: NextFunction) {
    const expenseDTO: IExpenseCreateDTO = this.matchedBodyData(req);
    const { tenantId, user } = req;

    try {
      const expense = await this.expensesApplication.createExpense(
        tenantId,
        expenseDTO,
        user
      );
      return res.status(200).send({
        id: expense.id,
        message: 'The expense has been created successfully.',
      });
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
    const expenseDTO: IExpenseEditDTO = this.matchedBodyData(req);
    const { tenantId, user } = req;

    try {
      await this.expensesApplication.editExpense(
        tenantId,
        expenseId,
        expenseDTO,
        user
      );
      return res.status(200).send({
        id: expenseId,
        message: 'The expense has been edited successfully.',
      });
    } catch (error) {
      next(error);
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
      await this.expensesApplication.deleteExpense(tenantId, expenseId, user);

      return res.status(200).send({
        id: expenseId,
        message: 'The expense has been deleted successfully.',
      });
    } catch (error) {
      next(error);
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
      await this.expensesApplication.publishExpense(tenantId, expenseId, user);

      return res.status(200).send({
        id: expenseId,
        message: 'The expense has been published successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve expenses list.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async getExpensesList(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const filter = {
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      page: 1,
      pageSize: 12,
      ...this.matchedQueryData(req),
    };

    try {
      const { expenses, pagination, filterMeta } =
        await this.expensesApplication.getExpenses(tenantId, filter);

      return res.status(200).send({
        expenses: this.transfromToResponse(expenses),
        pagination: this.transfromToResponse(pagination),
        filter_meta: this.transfromToResponse(filterMeta),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve expense details.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async getExpense(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { id: expenseId } = req.params;

    try {
      const expense = await this.expensesApplication.getExpense(
        tenantId,
        expenseId
      );
      return res.status(200).send(this.transfromToResponse({ expense }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Transform service errors to api response errors.
   * @param {Response} res
   * @param {ServiceError} error
   */
  private catchServiceErrors(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'expense_not_found') {
        return res.boom.badRequest('Expense not found.', {
          errors: [{ type: 'EXPENSE_NOT_FOUND', code: 100 }],
        });
      }
      if (error.errorType === 'EXPENSES_NOT_FOUND') {
        return res.boom.badRequest('Expenses not found.', {
          errors: [{ type: 'EXPENSES_NOT_FOUND', code: 110 }],
        });
      }
      if (error.errorType === 'total_amount_equals_zero') {
        return res.boom.badRequest('Expense total should not equal zero.', {
          errors: [{ type: 'TOTAL.AMOUNT.EQUALS.ZERO', code: 200 }],
        });
      }
      if (error.errorType === 'payment_account_not_found') {
        return res.boom.badRequest('Payment account not found.', {
          errors: [{ type: 'PAYMENT.ACCOUNT.NOT.FOUND', code: 300 }],
        });
      }
      if (error.errorType === 'some_expenses_not_found') {
        return res.boom.badRequest('Some expense accounts not found.', {
          errors: [{ type: 'SOME.EXPENSE.ACCOUNTS.NOT.FOUND', code: 400 }],
        });
      }
      if (error.errorType === 'payment_account_has_invalid_type') {
        return res.boom.badRequest('Payment account has invalid type.', {
          errors: [{ type: 'PAYMENT.ACCOUNT.HAS.INVALID.TYPE', code: 500 }],
        });
      }
      if (error.errorType === 'expenses_account_has_invalid_type') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'EXPENSES.ACCOUNT.HAS.INVALID.TYPE', code: 600 }],
        });
      }
      if (error.errorType === 'expense_already_published') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'EXPENSE_ALREADY_PUBLISHED', code: 700 }],
        });
      }
      if (error.errorType === 'contact_not_found') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'CONTACT_NOT_FOUND', code: 800 }],
        });
      }
      if (error.errorType === 'EXPENSE_HAS_ASSOCIATED_LANDED_COST') {
        return res.status(400).send({
          errors: [{ type: 'EXPENSE_HAS_ASSOCIATED_LANDED_COST', code: 900 }],
        });
      }
      if (error.errorType === 'ENTRIES_ALLOCATED_COST_COULD_NOT_DELETED') {
        return res.status(400).send({
          errors: [
            { type: 'ENTRIES_ALLOCATED_COST_COULD_NOT_DELETED', code: 1000 },
          ],
        });
      }
      if (
        error.errorType === 'LOCATED_COST_ENTRIES_SHOULD_BIGGE_THAN_NEW_ENTRIES'
      ) {
        return res.status(400).send({
          errors: [
            {
              type: 'LOCATED_COST_ENTRIES_SHOULD_BIGGE_THAN_NEW_ENTRIES',
              code: 1100,
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
    }
    next(error);
  }
}
