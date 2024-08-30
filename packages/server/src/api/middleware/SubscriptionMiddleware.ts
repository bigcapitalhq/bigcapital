import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';

const SupportedMethods = ['POST', 'PUT'];

export default (subscriptionSlug = 'main') =>
  async (req: Request, res: Response, next: NextFunction) => {
    const { tenant, tenantId } = req;
    const { subscriptionRepository } = Container.get('repositories');

    if (!tenant) {
      throw new Error('Should load `TenancyMiddlware` before this middleware.');
    }
    const subscription = await subscriptionRepository.getBySlugInTenant(
      subscriptionSlug,
      tenantId
    );
    // Validate in case there is no any already subscription.
    if (!subscription) {
      return res.boom.badRequest('Tenant has no subscription.', {
        errors: [{ type: 'TENANT.HAS.NO.SUBSCRIPTION' }],
      });
    }
    const isMethodSupported = SupportedMethods.includes(req.method);
    const isSubscriptionInactive = subscription.inactive();

    if (isMethodSupported && isSubscriptionInactive) {
      return res.boom.badRequest(null, {
        errors: [{ type: 'ORGANIZATION.SUBSCRIPTION.INACTIVE' }],
      });
    }
    next();
  };
