import { Inject, Service } from 'typedi';
import { NextFunction, Request, Response, Router } from 'express';
import BaseController from '@/api/controllers/BaseController';
import { CashflowApplication } from '@/services/Cashflow/CashflowApplication';
import { GetBankAccountSummary } from '@/services/Banking/BankAccounts/GetBankAccountSummary';

@Service()
export class BankAccountsController extends BaseController {
  @Inject()
  private getBankAccountSummaryService: GetBankAccountSummary;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get('/:bankAccountId/meta', this.getBankAccountSummary.bind(this));

    return router;
  }

  /**
   * Retrieves the bank account meta summary.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response|null>}
   */
  async getBankAccountSummary(
    req: Request<{ bankAccountId: number }>,
    res: Response,
    next: NextFunction
  ) {
    const { bankAccountId } = req.params;
    const { tenantId } = req;

    try {
      const data =
        await this.getBankAccountSummaryService.getBankAccountSummary(
          tenantId,
          bankAccountId
        );
      return res.status(200).send({ data });
    } catch (error) {
      next(error);
    }
  }
}
