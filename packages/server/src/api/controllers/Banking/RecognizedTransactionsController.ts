import { Inject, Service } from 'typedi';
import { NextFunction, Request, Response, Router } from 'express';
import { query } from 'express-validator';
import BaseController from '@/api/controllers/BaseController';
import { CashflowApplication } from '@/services/Cashflow/CashflowApplication';

@Service()
export class RecognizedTransactionsController extends BaseController {
  @Inject()
  private cashflowApplication: CashflowApplication;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/',
      [
        query('page').optional().isNumeric().toInt(),
        query('page_size').optional().isNumeric().toInt(),
        query('account_id').optional().isNumeric().toInt(),
      ],
      this.validationResult,
      this.getRecognizedTransactions.bind(this)
    );
    router.get(
      '/transactions/:uncategorizedTransactionId',
      this.getRecognizedTransaction.bind(this)
    );

    return router;
  }

  /**
   * Retrieves the recognized bank transactions.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response|null>}
   */
  async getRecognizedTransactions(
    req: Request<{ accountId: number }>,
    res: Response,
    next: NextFunction
  ) {
    const filter = this.matchedQueryData(req);
    const { tenantId } = req;

    try {
      const data = await this.cashflowApplication.getRecognizedTransactions(
        tenantId,
        filter
      );
      return res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves the recognized transaction of the ginen uncategorized transaction.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response|null>}
   */
  async getRecognizedTransaction(
    req: Request<{ uncategorizedTransactionId: number }>,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const { uncategorizedTransactionId } = req.params;

    try {
      const data = await this.cashflowApplication.getRecognizedTransaction(
        tenantId,
        uncategorizedTransactionId
      );
      return res.status(200).send({ data });
    } catch (error) {
      next(error);
    }
  }
}
