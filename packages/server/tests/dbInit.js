import CacheService from '@/services/Cache';
import { bindTenantModel, createTenant, createTenantFactory, dropTenant, login, systemFactory } from '~/testInit';

let tenantWebsite;
let tenantFactory;
let loginRes;

beforeEach(async () => {
  tenantWebsite = await createTenant();
  tenantFactory = createTenantFactory(tenantWebsite.tenantDb);

  bindTenantModel(tenantWebsite.tenantDb);
  loginRes = await login(tenantWebsite);

  CacheService.flush();
});

afterEach(async () => {
  await dropTenant(tenantWebsite);

  loginRes = null;
  tenantFactory = null;
  tenantWebsite = null;
});

export { tenantWebsite, tenantFactory, systemFactory, loginRes };
