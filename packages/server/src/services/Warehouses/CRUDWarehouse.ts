import { Inject, Service } from 'typedi';
import { ServiceError } from '@/exceptions';
import { ERRORS } from './constants';
import HasTenancyService from '@/services/Tenancy/TenancyService';

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
  }
}
