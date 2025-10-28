import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { throwIfTenantNotExists } from '../Organization/_utils';
import { TenantModel } from '@/modules/System/models/TenantModel';
import { Injectable } from '@nestjs/common';
import { ModelObject } from 'objection';

@Injectable()
export class GetCurrentOrganizationService {
  constructor(private readonly tenancyContext: TenancyContext) {}

  /**
   * Retrieve the current organization metadata.
   * @param {number} tenantId
   * @returns {Promise<ITenant[]>}
   */
  async getCurrentOrganization(): Promise<ModelObject<TenantModel>> {
    const tenant = await this.tenancyContext
      .getTenant()
      .withGraphFetched('subscriptions')
      .withGraphFetched('metadata');

    throwIfTenantNotExists(tenant);

    return tenant;
  }
}
