import { Container } from 'typedi';
import TenantsManager from '@/system/TenantsManager';
import tenantModelsLoader from '@/loaders/tenantModels';

export default async (req, res, next) => {
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
  const tenantsManager = Container.get(TenantsManager);

  Logger.info('[tenancy_middleware] trying get tenant by org. id from storage.');
  const tenant = await tenantsManager.getTenant(organizationId);

  Logger.info('[tenancy_middleware] initializing tenant knex instance.');
  const tenantKnex = tenantsManager.knexInstance(organizationId);

  // When the given organization id not found on the system storage.
  if (!tenant) {
    return notFoundOrganization();
  }
  // When user tenant not match the given organization id.
  if (tenant.id !== req.user.tenantId) {
    Logger.info('[tenancy_middleware] authorized user not match org. tenant.');
    return res.boom.unauthorized();
  }
  const models = tenantModelsLoader(tenantKnex);
  
  req.knex = tenantKnex;
  req.organizationId = organizationId;
  req.tenant = tenant;
  req.models = models;

  const tenantContainer = Container.of(`tenant-${tenant.id}`);

  tenantContainer.set('models', models);
  tenantContainer.set('knex', tenantKnex);
  tenantContainer.set('tenant', tenant);
  Logger.info('[tenancy_middleware] tenant dependencies injected to container.');

  if (res.locals) {
    tenantContainer.set('i18n', res.locals);
    Logger.info('[tenancy_middleware] i18n locals injected.');
  }
  next();
}
