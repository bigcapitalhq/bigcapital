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
import { SubscriptionApplication } from '@/services/Subscription/SubscriptionApplication';

@Service()
export class SubscriptionController extends BaseController {
  @Inject()
  private subscriptionService: SubscriptionService;

  @Inject()
  private lemonSqueezyService: LemonSqueezyService;

  @Inject()
  private subscriptionApp: SubscriptionApplication;

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
    router.post('/cancel', asyncMiddleware(this.cancelSubscription.bind(this)));
    router.post('/resume', asyncMiddleware(this.resumeSubscription.bind(this)));
    router.post(
      '/change',
      [body('variant_id').exists().trim()],
      this.validationResult,
      asyncMiddleware(this.changeSubscriptionPlan.bind(this))
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

  /**
   * Cancels the subscription of the current organization.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response|null>}
   */
  private async cancelSubscription(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;

    try {
      await this.subscriptionApp.cancelSubscription(tenantId, '455610');

      return res.status(200).send({
        status: 200,
        message: 'The organization subscription has been canceled.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Resumes the subscription of the current organization.
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   * @returns {Promise<Response | null>}
   */
  private async resumeSubscription(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;

    try {
      await this.subscriptionApp.resumeSubscription(tenantId);

      return res.status(200).send({
        status: 200,
        message: 'The organization subscription has been resumed.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Changes the main subscription plan of the current organization.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response | null>}
   */
  public async changeSubscriptionPlan(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const body = this.matchedBodyData(req);

    try {
      await this.subscriptionApp.changeSubscriptionPlan(
        tenantId,
        body.variantId
      );
      return res.status(200).send({
        message: 'The subscription plan has been changed.',
      });
    } catch (error) {
      next(error);
    }
  }
}
