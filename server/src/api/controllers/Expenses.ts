import { Inject, Service } from "typedi";
import { check, param, query } from 'express-validator';
import { Router, Request, Response, NextFunction } from 'express';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import BaseController from "api/controllers/BaseController";
import ExpensesService from "services/Expenses/ExpensesService";
import { IExpenseDTO } from 'interfaces';
import { ServiceError } from "exceptions";

@Service()
export default class ExpensesController extends BaseController {
  @Inject()
  expensesService: ExpensesService;

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
      asyncMiddleware(this.newExpense.bind(this))
    );
    router.post('/publish', [
        ...this.bulkSelectSchema,
      ],
      this.bulkPublishExpenses.bind(this)
    );
    router.post(
      '/:id/publish', [
        ...this.expenseParamSchema,
      ],
      this.validationResult,
      asyncMiddleware(this.publishExpense.bind(this))
    );
    router.post(
      '/:id', [
      ...this.expenseDTOSchema,
      ...this.expenseParamSchema,
    ],
      this.validationResult,
      asyncMiddleware(this.editExpense.bind(this)),
    );
    router.delete(
      '/:id', [
        ...this.expenseParamSchema,
      ],
      this.validationResult,
      asyncMiddleware(this.deleteExpense.bind(this))
    );
    router.delete('/', [
        ...this.bulkSelectSchema,
      ],
      this.validationResult,
      asyncMiddleware(this.bulkDeleteExpenses.bind(this))
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
      if (error instanceof ServiceError) {
        this.serviceErrorsTransformer(res, error);
      }
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
      if (error instanceof ServiceError) {
        this.serviceErrorsTransformer(res, error);
      }
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
    const { tenantId } = req;
    const { id: expenseId } = req.params;

    try {
      await this.expensesService.deleteExpense(tenantId, expenseId)
      return res.status(200).send({ id: expenseId });
    } catch (error) {
      if (error instanceof ServiceError) {
        this.serviceErrorsTransformer(res, error);
      }
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
    const { tenantId } = req;
    const { id: expenseId } = req.params;

    try {
      await this.expensesService.publishExpense(tenantId, expenseId)
      return res.status(200).send({  });
    } catch (error) {
      if (error instanceof ServiceError) {
        this.serviceErrorsTransformer(req, error);
      }
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
    const { tenantId } = req;
    const { ids: expensesIds } = req.params;

    try {
      await this.expensesService.deleteBulkExpenses(tenantId, expensesIds);
      return res.status(200).send({ ids: expensesIds });
    } catch (error) {
      if (error instanceof ServiceError) {
        this.serviceErrorsTransformer(req, error);
      }
      next(error);
    }
  }


  async bulkPublishExpenses(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;

    try {
      await this.expensesService.publishBulkExpenses(tenantId,);
      return res.status(200).send({});
    } catch (error) {
      if (error instanceof ServiceError) {
        this.serviceErrorsTransformer(req, error);
      }
      next(error);
    }
  }

  /**
   * Transform service errors to api response errors.
   * @param {Response} res 
   * @param {ServiceError} error 
   */
  serviceErrorsTransformer(res, error: ServiceError) {
    if (error.errorType === 'expense_not_found') {
      return res.boom.badRequest(null, {
        errors: [{ type: 'EXPENSE_NOT_FOUND' }],
      });
    }
    if (error.errorType === 'total_amount_equals_zero') {
      return res.boom.badRequest(null, {
        errors: [{ type: 'TOTAL.AMOUNT.EQUALS.ZERO' }],
      });
    }
    if (error.errorType === 'payment_account_not_found') {
      return res.boom.badRequest(null, {
        errors: [{ type: 'PAYMENT.ACCOUNT.NOT.FOUND', }],
      });
    }
    if (error.errorType === 'some_expenses_not_found') {
      return res.boom.badRequest(null, {
        errors: [{ type: 'SOME.EXPENSE.ACCOUNTS.NOT.FOUND', code: 200 }]
      })
    }
    if (error.errorType === 'payment_account_has_invalid_type') {
      return res.boom.badRequest(null, {
        errors: [{ type: 'PAYMENT.ACCOUNT.HAS.INVALID.TYPE' }],
      });
    }
    if (error.errorType === 'expenses_account_has_invalid_type') {
      return res.boom.badRequest(null, {
        errors: [{ type: 'EXPENSES.ACCOUNT.HAS.INVALID.TYPE' }]
      });
    }
  }
}