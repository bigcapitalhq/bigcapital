import { Service, Inject } from 'typedi';
import { ValidationChain, body, check, param, query } from 'express-validator';
import { Router, Request, Response, NextFunction } from 'express';
import { omit } from 'lodash';
import BaseController from '../BaseController';
import { ServiceError } from '@/exceptions';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import {
  AbilitySubject,
  CashflowAction,
  ICategorizeCashflowTransactioDTO,
} from '@/interfaces';
import { CashflowApplication } from '@/services/Cashflow/CashflowApplication';

@Service()
export default class NewCashflowTransactionController extends BaseController {
  @Inject()
  private cashflowApplication: CashflowApplication;

  /**
   * Router constructor.
   */
  public router() {
    const router = Router();

    router.get(
      '/transactions/uncategorized/:id',
      this.asyncMiddleware(this.getUncategorizedCashflowTransaction),
      this.catchServiceErrors
    );
    router.get(
      '/transactions/:id/uncategorized',
      this.getUncategorizedTransactionsValidationSchema,
      this.validationResult,
      this.asyncMiddleware(this.getUncategorizedCashflowTransactions),
      this.catchServiceErrors
    );
    router.post(
      '/transactions',
      CheckPolicies(CashflowAction.Create, AbilitySubject.Cashflow),
      this.newTransactionValidationSchema,
      this.validationResult,
      this.asyncMiddleware(this.newCashflowTransaction),
      this.catchServiceErrors
    );
    router.post(
      '/transactions/uncategorize/bulk',
      [
        body('ids').isArray({ min: 1 }),
        body('ids.*').exists().isNumeric().toInt(),
      ],
      this.validationResult,
      this.uncategorizeBulkTransactions.bind(this),
      this.catchServiceErrors
    );
    router.post(
      '/transactions/:id/uncategorize',
      this.revertCategorizedCashflowTransaction,
      this.catchServiceErrors
    );
    router.post(
      '/transactions/categorize',
      this.categorizeCashflowTransactionValidationSchema,
      this.validationResult,
      this.categorizeCashflowTransaction,
      this.catchServiceErrors
    );
    router.post(
      '/transaction/:id/categorize/expense',
      this.categorizeAsExpenseValidationSchema,
      this.validationResult,
      this.categorizesCashflowTransactionAsExpense,
      this.catchServiceErrors
    );
    return router;
  }

  /**
   * Getting uncategorized transactions validation schema.
   * @returns {ValidationChain}
   */
  public get getUncategorizedTransactionsValidationSchema() {
    return [
      param('id').exists().isNumeric().toInt(),
      query('page').optional().isNumeric().toInt(),
      query('page_size').optional().isNumeric().toInt(),
    ];
  }

  /**
   * Categorize as expense validation schema.
   */
  public get categorizeAsExpenseValidationSchema() {
    return [
      check('expense_account_id').exists(),
      check('date').isISO8601().exists(),
      check('reference_no').optional(),
      check('exchange_rate').optional().isFloat({ gt: 0 }).toFloat(),
    ];
  }

  /**
   * Categorize cashflow tranasction validation schema.
   */
  public get categorizeCashflowTransactionValidationSchema() {
    return [
      check('uncategorized_transaction_ids').exists().isArray({ min: 1 }),
      check('date').exists().isISO8601().toDate(),
      check('credit_account_id').exists().isInt().toInt(),
      check('transaction_number').optional(),
      check('transaction_type').exists(),
      check('reference_no').optional(),
      check('exchange_rate').optional().isFloat({ gt: 0 }).toFloat(),
      check('description').optional(),
      check('branch_id').optional({ nullable: true }).isNumeric().toInt(),
    ];
  }

  /**
   * New cashflow transaction validation schema.
   */
  public get newTransactionValidationSchema() {
    return [
      check('date').exists().isISO8601().toDate(),
      check('reference_no').optional({ nullable: true }).trim(),
      check('description')
        .optional({ nullable: true })
        .isLength({ min: 3 })
        .trim(),
      check('transaction_type').exists(),

      check('amount').exists().isFloat().toFloat(),
      check('cashflow_account_id').exists().isInt().toInt(),
      check('credit_account_id').exists().isInt().toInt(),

      check('exchange_rate').optional().isFloat({ gt: 0 }).toFloat(),
      check('branch_id').optional({ nullable: true }).isNumeric().toInt(),
      check('publish').default(false).isBoolean().toBoolean(),
    ];
  }

  /**
   * Creates a new cashflow transaction.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  private newCashflowTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId, userId } = req;
    const ownerContributionDTO = this.matchedBodyData(req);

    try {
      const cashflowTransaction =
        await this.cashflowApplication.createTransaction(
          tenantId,
          ownerContributionDTO,
          userId
        );
      return res.status(200).send({
        id: cashflowTransaction.id,
        message: 'New cashflow transaction has been created successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Revert the categorized cashflow transaction.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private revertCategorizedCashflowTransaction = async (
    req: Request<{ id: number }>,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: cashflowTransactionId } = req.params;

    try {
      const data = await this.cashflowApplication.uncategorizeTransaction(
        tenantId,
        cashflowTransactionId
      );
      return res.status(200).send({ data });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Uncategorize the given transactions in bulk.
   * @param {Request<{}>} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response | null>}
   */
  private uncategorizeBulkTransactions = async (
    req: Request<{}>,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { ids: uncategorizedTransactionIds } = this.matchedBodyData(req);

    try {
      await this.cashflowApplication.uncategorizeTransactions(
        tenantId,
        uncategorizedTransactionIds
      );
      return res.status(200).send({
        message: 'The given transactions have been uncategorized successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Categorize the cashflow transaction.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private categorizeCashflowTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const matchedObject = this.matchedBodyData(req);
    const categorizeDTO = omit(matchedObject, [
      'uncategorizedTransactionIds',
    ]) as ICategorizeCashflowTransactioDTO;

    const uncategorizedTransactionIds =
      matchedObject.uncategorizedTransactionIds;

    try {
      await this.cashflowApplication.categorizeTransaction(
        tenantId,
        uncategorizedTransactionIds,
        categorizeDTO
      );
      return res.status(200).send({
        message: 'The cashflow transaction has been created successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Categorize the transaction as expense transaction.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private categorizesCashflowTransactionAsExpense = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: cashflowTransactionId } = req.params;
    const cashflowTransaction = this.matchedBodyData(req);

    try {
      await this.cashflowApplication.categorizeAsExpense(
        tenantId,
        cashflowTransactionId,
        cashflowTransaction
      );
      return res.status(200).send({
        message: 'The cashflow transaction has been created successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieves the uncategorized cashflow transactions.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public getUncategorizedCashflowTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: transactionId } = req.params;

    try {
      const data = await this.cashflowApplication.getUncategorizedTransaction(
        tenantId,
        transactionId
      );
      return res.status(200).send({ data });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieves the uncategorized cashflow transactions.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public getUncategorizedCashflowTransactions = async (
    req: Request<{ id: number }>,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: accountId } = req.params;
    const query = this.matchedQueryData(req);

    try {
      const data = await this.cashflowApplication.getUncategorizedTransactions(
        tenantId,
        accountId,
        query
      );

      return res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handle the service errors.
   * @param error
   * @param {Request} req
   * @param {res
   * @param next
   * @returns
   */
  private catchServiceErrors(
    error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'CASHFLOW_ACCOUNTS_IDS_NOT_FOUND') {
        return res.boom.badRequest('Cashflow accounts ids not found.', {
          errors: [{ type: 'CASHFLOW_ACCOUNTS_IDS_NOT_FOUND', code: 100 }],
        });
      }
      if (error.errorType === 'CREDIT_ACCOUNTS_IDS_NOT_FOUND') {
        return res.boom.badRequest('Credit accounts ids not found.', {
          errors: [{ type: 'CREDIT_ACCOUNTS_IDS_NOT_FOUND', code: 200 }],
        });
      }
      if (error.errorType === 'CREDIT_ACCOUNTS_HAS_INVALID_TYPE') {
        return res.boom.badRequest('Cashflow .', {
          errors: [{ type: 'CREDIT_ACCOUNTS_HAS_INVALID_TYPE', code: 300 }],
        });
      }
      if (error.errorType === 'CASHFLOW_ACCOUNTS_HAS_INVALID_TYPE') {
        return res.boom.badRequest(
          'Cashflow accounts should be cash or bank type.',
          {
            errors: [{ type: 'CASHFLOW_ACCOUNTS_HAS_INVALID_TYPE', code: 300 }],
          }
        );
      }
      if (error.errorType === 'CASHFLOW_TRANSACTION_NOT_FOUND') {
        return res.boom.badRequest('Cashflow transaction not found.', {
          errors: [{ type: 'CASHFLOW_TRANSACTION_NOT_FOUND', code: 500 }],
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
      if (error.errorType === 'UNCATEGORIZED_TRANSACTION_TYPE_INVALID') {
        return res.boom.badRequest(null, {
          errors: [
            {
              type: 'UNCATEGORIZED_TRANSACTION_TYPE_INVALID',
              code: 4100,
            },
          ],
        });
      }
    }
    next(error);
  }
}
