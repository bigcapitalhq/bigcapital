import { Router } from 'express';
import { PlaidApplication } from '@/services/Banking/Plaid/PlaidApplication';
import { Request, Response } from 'express';
import { Inject, Service } from 'typedi';
import BaseController from '../BaseController';

@Service()
export class Webhooks extends BaseController {
  @Inject()
  private plaidApp: PlaidApplication;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.post('/plaid', this.plaidWebhooks.bind(this));

    return router;
  }

  /**
   * Listens to Plaid webhooks.
   * @param {Request} req
   * @param {Response} res
   * @returns {Response}
   */
  public async plaidWebhooks(req: Request, res: Response) {
    const { tenantId } = req;
    const {
      webhook_type: webhookType,
      webhook_code: webhookCode,
      item_id: plaidItemId,
    } = req.body;

    console.log(req.body, 'triggered');

    await this.plaidApp.webhooks(
      tenantId,
      plaidItemId,
      webhookType,
      webhookCode
    );
    return res.status(200).send({ code: 200, message: 'ok' });
  }
}
