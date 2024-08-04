import { Service, Inject } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { param, query } from 'express-validator';
import BaseController from '../BaseController';
import { ServiceError } from '@/exceptions';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { AbilitySubject, CashflowAction } from '@/interfaces';
import { CashflowApplication } from '@/services/Cashflow/CashflowApplication';
import { GetMatchedTransactionsFilter } from '@/services/Banking/Matching/types';
import { MatchBankTransactionsApplication } from '@/services/Banking/Matching/MatchBankTransactionsApplication';

@Service()
export default class GetCashflowAccounts extends BaseController {
  @Inject()
  private cashflowApplication: CashflowApplication;

  @Inject()
  private bankTransactionsMatchingApp: MatchBankTransactionsApplication;

  /**
   * Controller router.
   */
  public router() {
    const router = Router();

    router.get(
      '/transactions/matches',
      [
        query('uncategorizeTransactionsIds').exists().isArray({ min: 1 }),
        query('uncategorizeTransactionsIds.*').exists().isNumeric().toInt(),
      ],
      this.validationResult,
      this.getMatchedTransactions.bind(this)
    );
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
    req: Request<{ transactionId: number }>,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { transactionId } = req.params;

    try {
      const cashflowTransaction = await this.cashflowApplication.getTransaction(
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
   * Retrieves the matched transactions.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private async getMatchedTransactions(
    req: Request<
      { transactionId: number },
      null,
      null,
      { uncategorizeTransactionsIds: Array<number> }
    >,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const uncategorizeTransactionsIds = req.query.uncategorizeTransactionsIds;
    const filter = this.matchedQueryData(req) as GetMatchedTransactionsFilter;

    try {
      const data =
        await this.bankTransactionsMatchingApp.getMatchedTransactions(
          tenantId,
          uncategorizeTransactionsIds,
          filter
        );
      return res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  }

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
          'The given cashflow tranasction not found.',
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
