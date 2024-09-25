import { Container } from 'typedi';
import { ITenant } from '@/interfaces';
import { Request } from 'express';
import TenancyService from '@/services/Tenancy/TenancyService';
import TenantsManagerService from '@/services/Tenancy/TenantsManager';
import rtlDetect from 'rtl-detect';
import { Tenant } from '@/system/models';

export default (req: Request, tenant: ITenant) => {
  const { id: tenantId, organizationId } = tenant;

  const tenantServices = Container.get(TenancyService);
  const tenantsManager = Container.get(TenantsManagerService);

  // Initialize the knex instance.
  tenantsManager.setupKnexInstance(tenant);

  const tenantContainer = tenantServices.tenantContainer(tenantId);

  tenantContainer.set('i18n', injectI18nUtils());

  const knexInstance = tenantServices.knex(tenantId);
  const models = tenantServices.models(tenantId);
  const repositories = tenantServices.repositories(tenantId);
  const cacheInstance = tenantServices.cache(tenantId);

  req.knex = knexInstance;
  req.organizationId = organizationId;
  req.tenant = tenant;
  req.tenantId = tenant.id;
  req.models = models;
  req.repositories = repositories;
  req.cache = cacheInstance;
};

export const injectI18nUtils = (req) => {
  const globalI18n = Container.get('i18n');
  const locale = globalI18n.getLocale();
  const direction = rtlDetect.getLangDir(locale);

  return {
    locale,
    __: globalI18n.__,
    direction,
    isRtl: direction === 'rtl',
    isLtr: direction === 'ltr',
  };
};

export const initalizeTenantServices = async (tenantId: number) => {
  const tenant = await Tenant.query()
    .findById(tenantId)
    .withGraphFetched('metadata')
    .throwIfNotFound();

  const tenantServices = Container.get(TenancyService);
  const tenantsManager = Container.get(TenantsManagerService);

  // Initialize the knex instance.
  tenantsManager.setupKnexInstance(tenant);

  const tenantContainer = tenantServices.tenantContainer(tenantId);
  tenantContainer.set('i18n', injectI18nUtils());

  tenantServices.knex(tenantId);
  tenantServices.models(tenantId);
  tenantServices.repositories(tenantId);
  tenantServices.cache(tenantId);
};
