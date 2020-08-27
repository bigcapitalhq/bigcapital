import { Inject } from 'typedi';
import { Plan } from '@/system/models';
import SubscriptionService from '@/services/Subscription/SubscriptionService';

export default class PaymentMethodController {
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
    const { planSlug } = req.body;
    const foundPlan = await Plan.query().where('slug', planSlug).first();

    if (!foundPlan) {
      return res.status(400).send({
        errors: [{ type: 'PLAN.SLUG.NOT.EXISTS', code: 110 }],
      });
    }
    next();
  }
}