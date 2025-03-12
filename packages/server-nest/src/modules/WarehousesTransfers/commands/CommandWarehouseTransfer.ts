import { ERRORS } from '../constants';
import { WarehouseTransfer } from '../models/WarehouseTransfer';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { ItemsEntriesService } from '@/modules/Items/ItemsEntries.service';
import { Inject, Injectable } from '@nestjs/common';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ModelObject } from 'objection';
import { Item } from '@/modules/Items/models/Item';
import {
  ICreateWarehouseTransferDTO,
  IEditWarehouseTransferDTO,
} from '@/modules/Warehouses/Warehouse.types';
import { Warehouse } from '@/modules/Warehouses/models/Warehouse.model';

@Injectable()
export class CommandWarehouseTransfer {
  constructor(
    @Inject(Warehouse.name)
    private readonly warehouseModel: TenantModelProxy<typeof Warehouse>,

    @Inject(WarehouseTransfer.name)
    private readonly warehouseTransferModel: TenantModelProxy<
      typeof WarehouseTransfer
    >,
  ) {}

  /**
   *
   * @param {WarehouseTransfer} warehouseTransfer
   */
  throwIfTransferNotFound = (warehouseTransfer: WarehouseTransfer) => {
    if (!warehouseTransfer) {
      throw new ServiceError(ERRORS.WAREHOUSE_TRANSFER_NOT_FOUND);
    }
  };

  /**
   *
   * @param {number} branchId
   * @returns
   */
  async getWarehouseTransferOrThrowNotFound(branchId: number) {
    const foundTransfer = await this.warehouseTransferModel()
      .query()
      .findById(branchId);

    if (!foundTransfer) {
      throw new ServiceError(ERRORS.WAREHOUSE_TRANSFER_NOT_FOUND);
    }
    return foundTransfer;
  }

  /**
   * Validate the from/to warehouses should not be the same.
   * @param {ICreateWarehouseTransferDTO|IEditWarehouseTransferDTO} warehouseTransferDTO
   */
  validateWarehouseFromToNotSame(
    warehouseTransferDTO:
      | ICreateWarehouseTransferDTO
      | IEditWarehouseTransferDTO,
  ) {
    if (
      warehouseTransferDTO.fromWarehouseId ===
      warehouseTransferDTO.toWarehouseId
    ) {
      throw new ServiceError(ERRORS.WAREHOUSES_TRANSFER_SHOULD_NOT_BE_SAME);
    }
  }

  /**
   * Validates entries items should be inventory.
   * @param   {IItem[]} items
   * @returns {void}
   */
  validateItemsShouldBeInventory = (
    items: ModelObject<Item>[],
  ): void => {
    const nonInventoryItems = items.filter((item) => item.type !== 'inventory');

    if (nonInventoryItems.length > 0) {
      throw new ServiceError(
        ERRORS.WAREHOUSE_TRANSFER_ITEMS_SHOULD_BE_INVENTORY,
      );
    }
  };

  /**
   *
   * @param {number} fromWarehouseId
   * @returns
   */
  getToWarehouseOrThrow = async (fromWarehouseId: number) => {
    const warehouse = await this.warehouseModel()
      .query()
      .findById(fromWarehouseId);

    if (!warehouse) {
      throw new ServiceError(ERRORS.TO_WAREHOUSE_NOT_FOUND);
    }
    return warehouse;
  };

  /**
   *
   * @param {number} fromWarehouseId
   * @returns
   */
  getFromWarehouseOrThrow = async (fromWarehouseId: number) => {
    const warehouse = await this.warehouseModel()
      .query()
      .findById(fromWarehouseId);

    if (!warehouse) {
      throw new ServiceError(ERRORS.FROM_WAREHOUSE_NOT_FOUND);
    }
    return warehouse;
  };
}
