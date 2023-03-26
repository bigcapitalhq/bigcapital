import { Inject, Service } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { CRUDWarehouse } from './CRUDWarehouse';

@Service()
export class GetWarehouse extends CRUDWarehouse {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Retrieves warehouse details.
   * @param  {number} tenantId
   * @returns
   */
  public getWarehouse = async (tenantId: number, warehouseId: number) => {
    const { Warehouse } = this.tenancy.models(tenantId);

    const warehouse = await Warehouse.query().findById(warehouseId);

    this.throwIfWarehouseNotFound(warehouse);

    return warehouse;
  };
}
