import { ServiceError } from '@/modules/Items/ServiceError';
import { OrganizationBaseCurrencyLocking } from '../Organization/OrganizationBaseCurrencyLocking.service';
import { TenantModel } from '@/modules/System/models/TenantModel';
import { Injectable } from '@nestjs/common';
import { ERRORS } from '../Organization.constants';

@Injectable()
export class CommandOrganizationValidators {
  constructor(
    private readonly baseCurrencyMutateLocking: OrganizationBaseCurrencyLocking,
  ) {}

  /**
   * Validate mutate base currency ability.
   * @param {Tenant} tenant -
   * @param {string} newBaseCurrency -
   * @param {string} oldBaseCurrency -
   */
  async validateMutateBaseCurrency(
    tenant: TenantModel,
    newBaseCurrency: string,
    oldBaseCurrency: string,
  ) {
    if (tenant.isReady && newBaseCurrency !== oldBaseCurrency) {
      const isLocked =
        await this.baseCurrencyMutateLocking.isBaseCurrencyMutateLocked();

      if (isLocked) {
        throw new ServiceError(ERRORS.BASE_CURRENCY_MUTATE_LOCKED);
      }
    }
  }
}
