import { NextFunction, Router, Request, Response } from 'express';
import Container, { Inject, Service } from 'typedi';
import { PlaidApplication } from '@/services/Banking/Plaid/PlaidApplication';
import BaseController from '../BaseController';
import { LemonSqueezyWebhooks } from '@/services/Subscription/LemonSqueezyWebhooks';
import { PlaidWebhookTenantBootMiddleware } from '@/services/Banking/Plaid/PlaidWebhookTenantBootMiddleware';
import { StripeWebhooksController } from '../StripeIntegration/StripeWebhooksController';

@Service()
export class Webhooks extends BaseController {
  @Inject()
  private plaidApp: PlaidApplication;

  @Inject()
  private lemonWebhooksService: LemonSqueezyWebhooks;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.use('/plaid', PlaidWebhookTenantBootMiddleware);
    router.post('/plaid', this.plaidWebhooks.bind(this));

    router.post('/lemon', this.lemonWebhooks.bind(this));

    router.use(Container.get(StripeWebhooksController).router());

    return router;
  }

  /**
   * Listens to Lemon Squeezy webhooks events.
   * @param {Request} req
   * @param {Response} res
   * @returns {Response}
   */
  public async lemonWebhooks(req: Request, res: Response, next: NextFunction) {
    const data = req.body;
    const signature = req.headers['x-signature'] as string ?? '';
    const rawBody = req.rawBody;

    try {
      await this.lemonWebhooksService.handlePostWebhook(
        rawBody,
        data,
        signature
      );
      return res.status(200).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Listens to Plaid webhooks.
   * @param {Request} req
   * @param {Response} res
   * @returns {Response}
   */
  public async plaidWebhooks(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;

    try {
      const {
        webhook_type: webhookType,
        webhook_code: webhookCode,
        item_id: plaidItemId,
      } = req.body;

      await this.plaidApp.webhooks(
        tenantId,
        plaidItemId,
        webhookType,
        webhookCode
      );
      return res.status(200).send({ code: 200, message: 'ok' });
    } catch (error) {
      next(error);
    }
  }
}
