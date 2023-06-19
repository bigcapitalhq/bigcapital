import { Inject, Service } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { ServiceError, ServiceErrors } from '@/exceptions';
import { ERRORS } from './constants';

@Service()
export class WarehouseValidator {
  @Inject()
  tenancy: HasTenancyService;

  /**
   *
   * @param {number} tenantId
   * @param {number} warehouseId
   */
  public validateWarehouseNotOnlyWarehouse = async (
    tenantId: number,
    warehouseId: number
  ) => {
    const { Warehouse } = this.tenancy.models(tenantId);

    const warehouses = await Warehouse.query().whereNot('id', warehouseId);

    if (warehouses.length === 0) {
      throw new ServiceError(ERRORS.COULD_NOT_DELETE_ONLY_WAERHOUSE);
    }
  };

  /**
   * 
   * @param tenantId 
   * @param code 
   * @param exceptWarehouseId 
   */
  public validateWarehouseCodeUnique = async (
    tenantId: number,
    code: string,
    exceptWarehouseId?: number
  ) => {
    const { Warehouse } = this.tenancy.models(tenantId);

    const warehouse = await Warehouse.query()
      .onBuild((query) => {
        query.select(['id']);
        query.where('code', code);

        if (exceptWarehouseId) {
          query.whereNot('id', exceptWarehouseId);
        }
      })
      .first();

    if (warehouse) {
      throw new ServiceError(ERRORS.WAREHOUSE_CODE_NOT_UNIQUE);
    }
  };
}
