import { TenantModel } from '../System/models/TenantModel';
import { TenantAlreadyInitialized } from './exceptions/TenantAlreadyInitialized';
import { TenantAlreadySeeded } from './exceptions/TenantAlreadySeeded';
import { TenantDatabaseNotBuilt } from './exceptions/TenantDatabaseNotBuilt';

/**
 * Throws error if the tenant already seeded.
 * @throws {TenantAlreadySeeded}
 */
export const throwErrorIfTenantAlreadySeeded = (tenant: TenantModel) => {
  if (tenant.seededAt) {
    throw new TenantAlreadySeeded();
  }
};

/**
 * Throws error if the tenant database is not built yut.
 * @param {ITenant} tenant
 */
export const throwErrorIfTenantNotBuilt = (tenant: TenantModel) => {
  if (!tenant.initializedAt) {
    throw new TenantDatabaseNotBuilt();
  }
};

/**
 * Throws error if the tenant already migrated.
 * @throws {TenantAlreadyInitialized}
 */
export const throwErrorIfTenantAlreadyInitialized = (tenant: TenantModel) => {
  if (tenant.initializedAt) {
    throw new TenantAlreadyInitialized();
  }
};
