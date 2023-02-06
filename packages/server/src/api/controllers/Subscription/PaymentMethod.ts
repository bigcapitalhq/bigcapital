import { Inject } from 'typedi';
import { Request, Response } from 'express';
import { Plan } from '@/system/models';
import BaseController from '@/api/controllers/BaseController';
import SubscriptionService from '@/services/Subscription/SubscriptionService';

export default class PaymentMethodController extends BaseController {
  @Inject()
  subscriptionService: SubscriptionService;

  /**
   * Validate the given plan slug exists on the storage.
   * 
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next
   * 
   * @return {Response|void}
   */
  async validatePlanSlugExistance(req: Request, res: Response, next: Function) {
    const { planSlug } = this.matchedBodyData(req);
    const foundPlan = await Plan.query().where('slug', planSlug).first();

    if (!foundPlan) {
      return res.status(400).send({
        errors: [{ type: 'PLAN.SLUG.NOT.EXISTS', code: 110 }],
      });
    }
    next();
  }
}