import { Request, Response, NextFunction } from 'express';
import { SystemPlaidItem, Tenant } from '@/system/models';
import tenantDependencyInjection from '@/api/middleware/TenantDependencyInjection';

export const PlaidWebhookTenantBootMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { item_id: plaidItemId } = req.body;
  const plaidItem = await SystemPlaidItem.query().findOne({ plaidItemId });

  const notFoundOrganization = () => {
    return res.boom.unauthorized('Organization identication not found.', {
      errors: [{ type: 'ORGANIZATION.ID.NOT.FOUND', code: 100 }],
    });
  };
  // In case the given organization not found.
  if (!plaidItem) {
    return notFoundOrganization();
  }
  const tenant = await Tenant.query()
    .findById(plaidItem.tenantId)
    .withGraphFetched('metadata');

  // When the given organization id not found on the system storage.
  if (!tenant) {
    return notFoundOrganization();
  }
  tenantDependencyInjection(req, tenant);
  next();
};
