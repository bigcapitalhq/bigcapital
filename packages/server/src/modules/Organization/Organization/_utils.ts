import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from './constants';
import { TenantModel } from '@/modules/System/models/TenantModel';

/**
 * Throw base currency mutate locked error.
 */
export function throwBaseCurrencyMutateLocked() {
  throw new ServiceError(ERRORS.BASE_CURRENCY_MUTATE_LOCKED);
}

/**
 * Throws error in case the given tenant is undefined.
 * @param {TenantModel} tenant
 */
export function throwIfTenantNotExists(tenant: TenantModel) {
  if (!tenant) {
    throw new ServiceError(ERRORS.TENANT_NOT_FOUND);
  }
}

/**
 * Throws error in case the given tenant is already initialized.
 * @param {TenantModel} tenant
 */
export function throwIfTenantInitizalized(tenant: TenantModel) {
  if (tenant.builtAt) {
    throw new ServiceError(ERRORS.TENANT_ALREADY_BUILT);
  }
}

/**
 * Throw error if the tenant is building.
 * @param {TenantModel} tenant
 */
export function throwIfTenantIsBuilding(tenant: TenantModel) {
  if (tenant.buildJobId) {
    throw new ServiceError(ERRORS.TENANT_IS_BUILDING);
  }
}
