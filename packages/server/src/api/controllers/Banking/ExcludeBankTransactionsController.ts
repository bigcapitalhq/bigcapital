import { Inject, Service } from 'typedi';
import { param } from 'express-validator';
import { NextFunction, Request, Response, Router, query } from 'express';
import BaseController from '../BaseController';
import { ExcludeBankTransactionsApplication } from '@/services/Banking/Exclude/ExcludeBankTransactionsApplication';

@Service()
export class ExcludeBankTransactionsController extends BaseController {
  @Inject()
  private excludeBankTransactionApp: ExcludeBankTransactionsApplication;

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
    router.get(
      '/excluded',
      [],
      this.validationResult,
      this.getExcludedBankTransactions.bind(this)
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

  /**
   * Retrieves the excluded uncategorized bank transactions.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response|null>}
   */
  private async getExcludedBankTransactions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const { tenantId } = req;
    const filter = this.matchedBodyData(req);

    console.log('123');
    try {
      const data =
        await this.excludeBankTransactionApp.getExcludedBankTransactions(
          tenantId,
          filter
        );
      return res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  }
}
