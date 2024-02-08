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
    router.post('/exchange-token', this.exchangeToken.bind(this));
    router.post('/webhooks', this.webhooks.bind(this));

    return router;
  }

  /**
   * Retrieves the Plaid link token.
   * @param {Request} req
   * @param {response} res
   * @returns {Response}
   */
  private async linkToken(req: Request, res: Response) {
    const { tenantId } = req;

    const linkToken = await this.plaidApp.getLinkToken(tenantId);

    return res.status(200).send(linkToken);
  }

  /**
   *
   * @param {Request} req
   * @param {response} res
   * @returns {Response}
   */
  public async exchangeToken(req: Request, res: Response) {
    const { tenantId } = req;
    const { public_token, institution_id } = req.body;

    await this.plaidApp.exchangeToken(tenantId, {
      institutionId: institution_id,
      publicToken: public_token,
    });
    return res.status(200).send({});
  }

  public async webhooks(req: Request, res: Response) {
    const { tenantId } = req;
    const {
      webhook_type: webhookType,
      webhook_code: webhookCode,
      item_id: plaidItemId,
    } = req.body;

    await this.plaidApp.webhooks(
      tenantId,
      webhookType,
      plaidItemId,
      webhookCode
    );
    return res.status(200).send({ code: 200, message: 'ok' });
  }
}
