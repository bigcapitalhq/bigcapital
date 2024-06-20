import { Inject, Service } from 'typedi';
import { param } from 'express-validator';
import { NextFunction, Request, Response, Router } from 'express';
import BaseController from '../BaseController';
import { ExcludeBankTransactionsApplication } from '@/services/Banking/Exclude/ExcludeBankTransactionsApplication';

@Service()
export class ExcludeBankTransactionsController extends BaseController {
  @Inject()
  prviate excludeBankTransactionApp: ExcludeBankTransactionsApplication;

  /**
   * Router constructor.
   */
  public router() {
    const router = Router();

    router.put(
      '/transactions/:transactionId/exclude',
      [param('transactionId').exists()],
      this.validationResult,
      this.excludeBankTransaction.bind(this)
    );
    router.put(
      '/transactions/:transactionId/unexclude',
      [param('transactionId').exists()],
      this.validationResult,
      this.unexcludeBankTransaction.bind(this)
    );
    return router;
  }

  /**
   * Marks a bank transaction as excluded.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns
   */
  private async excludeBankTransaction(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const { tenantId } = req;
    const { transactionId } = req.params;

    try {
      await this.excludeBankTransactionApp.excludeBankTransaction(
        tenantId,
        transactionId
      );
      return res.status(200).send({
        message: 'The bank transaction has been excluded.',
        id: transactionId,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Marks a bank transaction as not excluded.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response|void>}
   */
  private async unexcludeBankTransaction(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const { tenantId } = req;
    const { transactionId } = req.params;

    try {
      await this.excludeBankTransactionApp.unexcludeBankTransaction(
        tenantId,
        transactionId
      );
      return res.status(200).send({
        message: 'The bank transaction has been unexcluded.',
        id: transactionId,
      });
    } catch (error) {
      next(error);
    }
  }
}
