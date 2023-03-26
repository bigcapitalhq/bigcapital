import { Inject } from 'typedi';
import {
  ICreateWarehouseTransferDTO,
  IEditWarehouseTransferDTO,
  IItem,
} from '@/interfaces';
import { ServiceError } from '@/exceptions';
import { ERRORS } from './constants';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import ItemsEntriesService from '@/services/Items/ItemsEntriesService';
import { CRUDWarehouseTransfer } from './CRUDWarehouseTransfer';

export class CommandWarehouseTransfer extends CRUDWarehouseTransfer {
  @Inject()
  tenancy: HasTenancyService;

  @Inject()
  itemsEntries: ItemsEntriesService;

  /**
   * Validate the from/to warehouses should not be the same.
   * @param {ICreateWarehouseTransferDTO|IEditWarehouseTransferDTO} warehouseTransferDTO
   */
  protected validateWarehouseFromToNotSame = (
    warehouseTransferDTO:
      | ICreateWarehouseTransferDTO
      | IEditWarehouseTransferDTO
  ) => {
    if (
      warehouseTransferDTO.fromWarehouseId ===
      warehouseTransferDTO.toWarehouseId
    ) {
      throw new ServiceError(ERRORS.WAREHOUSES_TRANSFER_SHOULD_NOT_BE_SAME);
    }
  };

  /**
   * Validates entries items should be inventory.
   * @param   {IItem[]} items
   * @returns {void}
   */
  protected validateItemsShouldBeInventory = (items: IItem[]): void => {
    const nonInventoryItems = items.filter((item) => item.type !== 'inventory');

    if (nonInventoryItems.length > 0) {
      throw new ServiceError(
        ERRORS.WAREHOUSE_TRANSFER_ITEMS_SHOULD_BE_INVENTORY
      );
    }
  };

  protected getToWarehouseOrThrow = async (
    tenantId: number,
    fromWarehouseId: number
  ) => {
    const { Warehouse } = this.tenancy.models(tenantId);

    const warehouse = await Warehouse.query().findById(fromWarehouseId);

    if (!warehouse) {
      throw new ServiceError(ERRORS.TO_WAREHOUSE_NOT_FOUND);
    }
    return warehouse;
  };

  protected getFromWarehouseOrThrow = async (
    tenantId: number,
    fromWarehouseId: number
  ) => {
    const { Warehouse } = this.tenancy.models(tenantId);

    const warehouse = await Warehouse.query().findById(fromWarehouseId);

    if (!warehouse) {
      throw new ServiceError(ERRORS.FROM_WAREHOUSE_NOT_FOUND);
    }
    return warehouse;
  };
}
