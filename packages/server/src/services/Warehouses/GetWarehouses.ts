import { Inject, Service } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class GetWarehouses {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Retrieves warehouses list.
   * @param  {number} tenantId 
   * @returns 
   */
  public getWarehouses = async (tenantId: number) => {
    const { Warehouse } = this.tenancy.models(tenantId);

    const warehouses = await Warehouse.query().orderBy('name', 'DESC');

    return warehouses;
  };
}
