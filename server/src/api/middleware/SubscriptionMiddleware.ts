import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';

export default (subscriptionSlug = 'main') => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { tenant, tenantId } = req;
  const Logger = Container.get('logger');
  const { subscriptionRepository } = Container.get('repositories');

  if (!tenant) {
    throw new Error('Should load `TenancyMiddlware` before this middleware.');
  }
  Logger.info('[subscription_middleware] trying get tenant main subscription.');
  const subscription = await subscriptionRepository.getBySlugInTenant(
    subscriptionSlug,
    tenantId
  );
  // Validate in case there is no any already subscription.
  if (!subscription) {
    Logger.info('[subscription_middleware] tenant has no subscription.', {
      tenantId,
    });
    return res.boom.badRequest('Tenant has no subscription.', {
      errors: [{ type: 'TENANT.HAS.NO.SUBSCRIPTION' }],
    });
  }
  // Validate in case the subscription is inactive.
  else if (subscription.inactive()) {
    Logger.info(
      '[subscription_middleware] tenant main subscription is expired.',
      { tenantId }
    );
    return res.boom.badRequest(null, {
      errors: [{ type: 'ORGANIZATION.SUBSCRIPTION.INACTIVE' }],
    });
  }
  next();
};
