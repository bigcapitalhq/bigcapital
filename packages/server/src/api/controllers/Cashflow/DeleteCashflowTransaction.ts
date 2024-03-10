import { Service, Inject } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { param } from 'express-validator';
import BaseController from '../BaseController';
import { ServiceError } from '@/exceptions';
import CheckPolicies from '@/api/middleware/CheckPolicies';

import { AbilitySubject, CashflowAction } from '@/interfaces';
import { CashflowApplication } from '@/services/Cashflow/CashflowApplication';

@Service()
export default class DeleteCashflowTransactionController extends BaseController {
  @Inject()
  private cashflowApplication: CashflowApplication;

  /**
   * Controller router.
   */
  public router() {
    const router = Router();

    router.delete(
      '/transactions/:transactionId',
      CheckPolicies(CashflowAction.Delete, AbilitySubject.Cashflow),
      [param('transactionId').exists().isInt().toInt()],
      this.asyncMiddleware(this.deleteCashflowTransaction),
      this.catchServiceErrors
    );
    return router;
  }

  /**
   * Retrieve the cashflow account transactions.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private deleteCashflowTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { transactionId } = req.params;

    try {
      const { oldCashflowTransaction } =
        await this.cashflowApplication.deleteTransaction(
          tenantId,
          transactionId
        );

      return res.status(200).send({
        id: oldCashflowTransaction.id,
        message: 'The cashflow transaction has been deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Catches the service errors.
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
      if (error.errorType === 'CASHFLOW_TRANSACTION_NOT_FOUND') {
        return res.boom.badRequest(
          'The given cashflow transaction not found.',
          {
            errors: [{ type: 'CASHFLOW_TRANSACTION_NOT_FOUND', code: 100 }],
          }
        );
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
        error.errorType ===
        'CANNOT_DELETE_TRANSACTION_CONVERTED_FROM_UNCATEGORIZED'
      ) {
        return res.boom.badRequest(null, {
          errors: [
            {
              type: 'CANNOT_DELETE_TRANSACTION_CONVERTED_FROM_UNCATEGORIZED',
              code: 4100,
            },
          ],
        });
      }
    }
    next(error);
  }
}
