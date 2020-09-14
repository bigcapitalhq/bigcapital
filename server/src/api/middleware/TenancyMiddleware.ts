import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import tenantDependencyInjection from 'api/middleware/TenantDependencyInjection'

export default async (req: Request, res: Response, next: NextFunction) => {
  const Logger = Container.get('logger');
  const organizationId = req.headers['organization-id'] || req.query.organization;

  const notFoundOrganization = () => {
    Logger.info('[tenancy_middleware] organization id not found.');
    return res.boom.unauthorized(
      'Organization identication not found.',
      { errors: [{ type: 'ORGANIZATION.ID.NOT.FOUND', code: 100 }] },
    );
  }
  // In case the given organization not found.
  if (!organizationId) {
    return notFoundOrganization();
  }
  const { tenantRepository } = Container.get('repositories');

  Logger.info('[tenancy_middleware] trying get tenant by org. id from storage.');
  const tenant = await tenantRepository.getByOrgId(organizationId);

  // When the given organization id not found on the system storage.
  if (!tenant) {
    return notFoundOrganization();
  }
  // When user tenant not match the given organization id.
  if (tenant.id !== req.user.tenantId) {
    Logger.info('[tenancy_middleware] authorized user not match org. tenant.');
    return res.boom.unauthorized();
  }
  tenantDependencyInjection(req, tenant);
  next();
}
