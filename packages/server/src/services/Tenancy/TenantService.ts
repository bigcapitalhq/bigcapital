import { Service } from 'typedi';
import { Tenant } from '@/system/models';
import ModelEntityNotFound from '@/exceptions/ModelEntityNotFound';

@Service()
export class TenantService {
  /**
   * Retrieves tenant by id.
   * @param {number} tenantId
   * @returns {Promise<any>}
   */
  public async getTenantById(tenantId: number): Promise<any> {
    const tenant = await Tenant.query()
      .findById(tenantId)
      .withGraphFetched('metadata');

    if (!tenant) throw new ModelEntityNotFound(tenantId);

    return tenant;
  }
}
