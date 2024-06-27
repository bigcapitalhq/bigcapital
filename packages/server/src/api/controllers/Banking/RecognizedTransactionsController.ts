import { Inject, Service } from 'typedi';
import { NextFunction, Request, Response, Router } from 'express';
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
      '/accounts/:accountId',
      this.getRecognizedTransactions.bind(this)
    );

    return router;
  }
  k;
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
    const { accountId } = req.params;
    const { tenantId } = req;

    try {
      const data = await this.cashflowApplication.getRecognizedTransactions(
        tenantId,
        accountId
      );
      return res.status(200).send({ data });
    } catch (error) {
      next(error);
    }
  }
}
