import { Inject, Service } from 'typedi';
import { NextFunction, Request, Response, Router } from 'express';
import BaseController from '@/api/controllers/BaseController';
import { GetBankAccountSummary } from '@/services/Banking/BankAccounts/GetBankAccountSummary';
import { BankAccountsApplication } from '@/services/Banking/BankAccounts/BankAccountsApplication';

@Service()
export class BankAccountsController extends BaseController {
  @Inject()
  private getBankAccountSummaryService: GetBankAccountSummary;

  @Inject()
  private bankAccountsApp: BankAccountsApplication;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get('/:bankAccountId/meta', this.getBankAccountSummary.bind(this));
    router.post(
      '/:bankAccountId/disconnect',
      this.disconnectBankAccount.bind(this)
    );
    router.post('/:bankAccountId/update', this.refreshBankAccount.bind(this));
    router.post(
      '/:bankAccountId/pause_feeds',
      this.pauseBankAccountFeeds.bind(this)
    );
    router.post(
      '/:bankAccountId/resume_feeds',
      this.resumeBankAccountFeeds.bind(this)
    );

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

  /**
   * Disonnect the given bank account.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response|null>}
   */
  async disconnectBankAccount(
    req: Request<{ bankAccountId: number }>,
    res: Response,
    next: NextFunction
  ) {
    const { bankAccountId } = req.params;
    const { tenantId } = req;

    try {
      await this.bankAccountsApp.disconnectBankAccount(tenantId, bankAccountId);

      return res.status(200).send({
        id: bankAccountId,
        message: 'The bank account has been disconnected.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh the given bank account.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response|null>}
   */
  async refreshBankAccount(
    req: Request<{ bankAccountId: number }>,
    res: Response,
    next: NextFunction
  ) {
    const { bankAccountId } = req.params;
    const { tenantId } = req;

    try {
      await this.bankAccountsApp.refreshBankAccount(tenantId, bankAccountId);

      return res.status(200).send({
        id: bankAccountId,
        message: 'The bank account has been disconnected.',
      });
    } catch (error) {
      next(error);
    }
  }

  async resumeBankAccountFeeds(
    req: Request<{ bankAccountId: number }>,
    res: Response,
    next: NextFunction
  ) {
    const { bankAccountId } = req.params;
    const { tenantId } = req;

    try {
      await this.bankAccountsApp.resumeBankAccount(tenantId, bankAccountId);

      return res.status(200).send({
        message: '',
      });
    } catch (error) {
      next(error);
    }
  }

  async pauseBankAccountFeeds(
    req: Request<{ bankAccountId: number }>,
    res: Response,
    next: NextFunction
  ) {
    const { bankAccountId } = req.params;
    const { tenantId } = req;

    try {
      await this.bankAccountsApp.pauseBankAccount(tenantId, bankAccountId);

      return res.status(200).send({
        message: '',
      });
    } catch (error) {
      next(error);
    }
  }
}
