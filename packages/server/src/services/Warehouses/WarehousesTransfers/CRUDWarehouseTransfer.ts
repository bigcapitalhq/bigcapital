import { ServiceError } from '@/exceptions';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import { ERRORS } from './constants';

@Service()
export class CRUDWarehouseTransfer {
  @Inject()
  tenancy: HasTenancyService;

  throwIfTransferNotFound = (warehouseTransfer) => {
    if (!warehouseTransfer) {
      throw new ServiceError(ERRORS.WAREHOUSE_TRANSFER_NOT_FOUND);
    }
  };

  public getWarehouseTransferOrThrowNotFound = async (tenantId: number, branchId: number) => {
    const { WarehouseTransfer } = this.tenancy.models(tenantId);

    const foundTransfer = await WarehouseTransfer.query().findById(branchId);

    if (!foundTransfer) {
      throw new ServiceError(ERRORS.WAREHOUSE_TRANSFER_NOT_FOUND);
    }
    return foundTransfer;
  };
}
