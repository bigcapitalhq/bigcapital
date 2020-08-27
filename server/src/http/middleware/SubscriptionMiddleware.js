
export default (subscriptionSlug = 'main') => async (req, res, next) => {
  const { tenant } = req;

  if (!tenant) {
    throw new Error('Should load `TenancyMiddlware` before this middleware.');
  }
  const subscription = await tenant
    .$relatedQuery('subscriptions')
    .modify('subscriptionBySlug', subscriptionSlug)
    .first();

  // Validate in case there is no any already subscription.
  if (!subscription) {
    return res.status(400).send({
      errors: [{ type: 'TENANT.HAS.NO.SUBSCRIPTION' }],
    });
  }
  // Validate in case the subscription is inactive.
  else if (subscription.inactive()) {
    return res.status(400).send({
      errors: [{ type: 'ORGANIZATION.SUBSCRIPTION.INACTIVE' }],
    });
  }
  next();
};