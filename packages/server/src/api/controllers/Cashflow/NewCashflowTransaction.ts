import { Service, Inject } from 'typedi';
import { check } from 'express-validator';
import { Router, Request, Response, NextFunction } from 'express';
import BaseController from '../BaseController';
import { ServiceError } from '@/exceptions';
import NewCashflowTransactionService from '@/services/Cashflow/NewCashflowTransactionService';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { AbilitySubject, CashflowAction } from '@/interfaces';

@Service()
export default class NewCashflowTransactionController extends BaseController {
  @Inject()
  private newCashflowTransactionService: NewCashflowTransactionService;

  /**
   * Router constructor.
   */
  public router() {
    const router = Router();

    router.post(
      '/transactions',
      CheckPolicies(CashflowAction.Create, AbilitySubject.Cashflow),
      this.newTransactionValidationSchema,
      this.validationResult,
      this.asyncMiddleware(this.newCashflowTransaction),
      this.catchServiceErrors
    );
    return router;
  }

  /**
   * New cashflow transaction validation schema.
   */
  get newTransactionValidationSchema() {
    return [
      check('date').exists().isISO8601().toDate(),
      check('reference_no').optional({ nullable: true }).trim().escape(),
      check('description')
        .optional({ nullable: true })
        .isLength({ min: 3 })
        .trim()
        .escape(),
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
      const { cashflowTransaction } =
        await this.newCashflowTransactionService.newCashflowTransaction(
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
   * Handle the service errors.
   * @param error
   * @param req
   * @param res
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
    }
    next(error);
  }
}
