import { ServiceError } from '@/exceptions';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject } from 'typedi';
import { ERRORS } from './contants';

export class CRUDWarehouse {
  @Inject()
  tenancy: HasTenancyService;

  getWarehouseOrThrowNotFound = async (tenantId: number, warehouseId: number) => {
    const { Warehouse } = this.tenancy.models(tenantId);

    const foundWarehouse = await Warehouse.query().findById(warehouseId);

    if (!foundWarehouse) {
      throw new ServiceError(ERRORS.WAREHOUSE_NOT_FOUND);
    }
    return foundWarehouse;
  };

  throwIfWarehouseNotFound = (warehouse) => {
    if (!warehouse) {
      throw new ServiceError(ERRORS.WAREHOUSE_NOT_FOUND);
    }
  };
}
