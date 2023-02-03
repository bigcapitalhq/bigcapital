import { Service, Inject } from 'typedi';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { ServiceError } from '@/exceptions';
import { ERRORS } from './constants';

@Service()
export class CRUDWarehouseTransfer {
  @Inject()
  tenancy: HasTenancyService;


  throwIfTransferNotFound = (warehouseTransfer) => {
    if (!warehouseTransfer) {
      throw new ServiceError(ERRORS.WAREHOUSE_TRANSFER_NOT_FOUND);
    }
  }

  public getWarehouseTransferOrThrowNotFound = async (
    tenantId: number,
    branchId: number
  ) => {
    const { WarehouseTransfer } = this.tenancy.models(tenantId);

    const foundTransfer = await WarehouseTransfer.query().findById(branchId);

    if (!foundTransfer) {
      throw new ServiceError(ERRORS.WAREHOUSE_TRANSFER_NOT_FOUND);
    }
    return foundTransfer;
  };
}
