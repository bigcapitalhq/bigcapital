import { ModelObject } from 'objection';
import { Inject, Injectable } from '@nestjs/common';
import { ERRORS } from '../constants';
import { WarehouseTransfer } from '../models/WarehouseTransfer';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { ServiceError } from '@/modules/Items/ServiceError';
import { Item } from '@/modules/Items/models/Item';
import { Warehouse } from '@/modules/Warehouses/models/Warehouse.model';
import {
  CreateWarehouseTransferDto,
  EditWarehouseTransferDto,
} from '../dtos/WarehouseTransfer.dto';

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
   * Throws error if warehouse transfer not found.
   * @param {WarehouseTransfer} warehouseTransfer
   */
  throwIfTransferNotFound = (warehouseTransfer: WarehouseTransfer) => {
    if (!warehouseTransfer) {
      throw new ServiceError(ERRORS.WAREHOUSE_TRANSFER_NOT_FOUND);
    }
  };

  /**
   * Retrieves the warehouse transfer or throw not found service error.
   * @param {number} branchId
   * @returns {Promise<WarehouseTransfer>}
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
    warehouseTransferDTO: CreateWarehouseTransferDto | EditWarehouseTransferDto,
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
   * @param {ModelObject<Item>[]} items - Items.
   * @returns {void}
   */
  validateItemsShouldBeInventory = (items: ModelObject<Item>[]): void => {
    const nonInventoryItems = items.filter((item) => item.type !== 'inventory');

    if (nonInventoryItems.length > 0) {
      throw new ServiceError(
        ERRORS.WAREHOUSE_TRANSFER_ITEMS_SHOULD_BE_INVENTORY,
      );
    }
  };

  /**
   * Retrieves the to warehouse or throw not found service error.
   * @param {number} fromWarehouseId - From warehouse id.
   * @returns {Promise<Warehouse>}
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
