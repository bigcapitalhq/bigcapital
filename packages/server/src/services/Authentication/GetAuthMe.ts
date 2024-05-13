import { Inject, Service } from 'typedi';
import { ITenant } from '@/interfaces';
import { TenantService } from '@/services/Tenancy/TenantService';

@Service()
export class GetAuthMe {
  @Inject()
  private tenantService: TenantService;

  /**
   * Retrieves the authenticated tenant.
   * @param {number} tenantId
   * @returns {Promise<ITenant>}
   */
  public async getAuthTenant(tenantId: number): Promise<ITenant> {
    const tenant = await this.tenantService.getTenantById(tenantId);

    return tenant;
  }
}
