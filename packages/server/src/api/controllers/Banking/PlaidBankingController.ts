import { Inject, Service } from 'typedi';
import { Router, Request, Response } from 'express';
import BaseController from '@/api/controllers/BaseController';
import { PlaidApplication } from '@/services/Banking/Plaid/PlaidApplication';

@Service()
export class PlaidBankingController extends BaseController {
  @Inject()
  private plaidApp: PlaidApplication;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.post('/link-token', this.linkToken.bind(this));

    return router;
  }

  private async linkToken(req: Request, res: Response) {
    const { tenantId } = req;

    const linkToken = await this.plaidApp.getLinkToken(tenantId);

    return res.status(200).send(linkToken);
  }
}
