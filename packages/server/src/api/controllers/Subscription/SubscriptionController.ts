import { Router, Request, Response, NextFunction } from 'express';
import { Service, Inject } from 'typedi';
import { body } from 'express-validator';
import JWTAuth from '@/api/middleware/jwtAuth';
import TenancyMiddleware from '@/api/middleware/TenancyMiddleware';
import AttachCurrentTenantUser from '@/api/middleware/AttachCurrentTenantUser';
import SubscriptionService from '@/services/Subscription/SubscriptionService';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import BaseController from '../BaseController';
import { LemonSqueezyService } from '@/services/Subscription/LemonSqueezyService';

@Service()
export class SubscriptionController extends BaseController {
  @Inject()
  private subscriptionService: SubscriptionService;

  @Inject()
  private lemonSqueezyService: LemonSqueezyService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.use(JWTAuth);
    router.use(AttachCurrentTenantUser);
    router.use(TenancyMiddleware);

    router.post(
      '/lemon/checkout_url',
      [body('variantId').exists().trim()],
      this.validationResult,
      this.getCheckoutUrl.bind(this)
    );
    router.get('/', asyncMiddleware(this.getSubscriptions.bind(this)));

    return router;
  }

  /**
   * Retrieve all subscriptions of the authenticated user's tenant.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private async getSubscriptions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;

    try {
      const subscriptions = await this.subscriptionService.getSubscriptions(
        tenantId
      );
      return res.status(200).send({ subscriptions });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves the LemonSqueezy checkout url.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private async getCheckoutUrl(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { variantId } = this.matchedBodyData(req);
    const { user } = req;

    try {
      const checkout = await this.lemonSqueezyService.getCheckout(
        variantId,
        user
      );
      return res.status(200).send(checkout);
    } catch (error) {
      next(error);
    }
  }
}
