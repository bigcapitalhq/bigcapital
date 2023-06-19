import { Service, Inject } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { param } from 'express-validator';
import BaseController from '../BaseController';
import GetCashflowTransactionsService from '@/services/Cashflow/GetCashflowTransactionsService';
import { ServiceError } from '@/exceptions';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { AbilitySubject, CashflowAction } from '@/interfaces';

@Service()
export default class GetCashflowAccounts extends BaseController {
  @Inject()
  getCashflowTransactionsService: GetCashflowTransactionsService;

  /**
   * Controller router.
   */
  public router() {
    const router = Router();

    router.get(
      '/transactions/:transactionId',
      CheckPolicies(CashflowAction.View, AbilitySubject.Cashflow),
      [param('transactionId').exists().isInt().toInt()],
      this.asyncMiddleware(this.getCashflowTransaction),
      this.catchServiceErrors
    );
    return router;
  }

  /**
   * Retrieve the cashflow account transactions.
   * @param {Request} req - Request object.
   * @param {Response} res - Response object.
   * @param {NextFunction} next
   */
  private getCashflowTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { transactionId } = req.params;

    try {
      const cashflowTransaction =
        await this.getCashflowTransactionsService.getCashflowTransaction(
          tenantId,
          transactionId
        );

      return res.status(200).send({
        cashflow_transaction: this.transfromToResponse(cashflowTransaction),
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Catches the service errors.
   * @param {Error} error - Error.
   * @param {Request} req - Request.
   * @param {Response} res - Response.
   * @param {NextFunction} next -
   */
  private catchServiceErrors(
    error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'CASHFLOW_TRANSACTION_NOT_FOUND') {
        return res.boom.badRequest(
          'The given cashflow transaction not found.',
          {
            errors: [{ type: 'CASHFLOW_TRANSACTION_NOT_FOUND', code: 200 }],
          }
        );
      }
      if (error.errorType === 'ACCOUNT_ID_HAS_INVALID_TYPE') {
        return res.boom.badRequest(
          'The given cashflow account has invalid type.',
          {
            errors: [{ type: 'ACCOUNT_ID_HAS_INVALID_TYPE', code: 300 }],
          }
        );
      }
      if (error.errorType === 'ACCOUNT_NOT_FOUND') {
        return res.boom.badRequest('The given account not found.', {
          errors: [{ type: 'ACCOUNT_NOT_FOUND', code: 400 }],
        });
      }
    }
    next(error);
  }
}
