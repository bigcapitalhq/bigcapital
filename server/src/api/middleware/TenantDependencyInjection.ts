import { Container } from 'typedi';
import { ITenant } from 'interfaces';
import { Request } from 'express';
import TenancyService from 'services/Tenancy/TenancyService';
import TenantsManagerService from 'services/Tenancy/TenantsManager';

export default (req: Request, tenant: ITenant) => {
  const { id: tenantId, organizationId } = tenant;

  const tenantServices = Container.get(TenancyService);
  const tenantsManager = Container.get(TenantsManagerService);

  // Initialize the knex instance.
  tenantsManager.setupKnexInstance(tenant);
  
  const knexInstance = tenantServices.knex(tenantId);
  const models = tenantServices.models(tenantId);
  const repositories = tenantServices.repositories(tenantId)
  const cacheInstance = tenantServices.cache(tenantId);

  const tenantContainer = tenantServices.tenantContainer(tenantId);

  tenantContainer.set('i18n', { __: req.__ });

  req.knex = knexInstance;
  req.organizationId = organizationId;
  req.tenant = tenant;
  req.tenantId = tenant.id;
  req.models = models;
  req.repositories = repositories;
  req.cache = cacheInstance;
}