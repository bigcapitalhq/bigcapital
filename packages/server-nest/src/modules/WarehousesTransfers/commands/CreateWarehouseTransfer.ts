import { Knex } from 'knex';
import { omit, get, isNumber } from 'lodash';
import * as R from 'ramda';
import {
  ICreateWarehouseTransferDTO,
  IWarehouseTransferCreate,
  IWarehouseTransferCreated,
  IWarehouseTransferEntryDTO,
} from '@/modules/Warehouses/Warehouse.types';
import { CommandWarehouseTransfer } from './CommandWarehouseTransfer';
import { WarehouseTransferAutoIncrement } from './WarehouseTransferAutoIncrement';
import { WarehouseTransfer } from '../models/WarehouseTransfer';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ItemsEntriesService } from '@/modules/Items/ItemsEntries.service';
import { InventoryItemCostService } from '@/modules/InventoryCost/commands/InventoryCosts.service';
import { Inject, Injectable } from '@nestjs/common';
import { events } from '@/common/events/events';
import { IInventoryItemCostMeta } from '@/modules/InventoryCost/types/InventoryCost.types';
import { ModelObject } from 'objection';
import { WarehouseTransferEntry } from '../models/WarehouseTransferEntry';

@Injectable()
export class CreateWarehouseTransfer {
  /**
   * @param {UnitOfWork} uow - Unit of work.
   * @param {EventEmitter2} eventPublisher - Event publisher.
   * @param {ItemsEntriesService} itemsEntries - Items entries service.
   * @param {InventoryItemCostService} inventoryItemCost - Inventory item cost service.
   * @param {WarehouseTransferAutoIncrement} autoIncrementOrders - Warehouse transfer auto increment.
   * @param {CommandWarehouseTransfer} commandWarehouseTransfer - Command warehouse transfer.
   * @param {TenantModelProxy<typeof WarehouseTransfer>} warehouseTransferModel - Warehouse transfer model.
   */
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,
    private readonly itemsEntries: ItemsEntriesService,
    private readonly inventoryItemCost: InventoryItemCostService,
    private readonly autoIncrementOrders: WarehouseTransferAutoIncrement,
    private readonly commandWarehouseTransfer: CommandWarehouseTransfer,

    @Inject(WarehouseTransfer.name)
    private readonly warehouseTransferModel: TenantModelProxy<
      typeof WarehouseTransfer
    >,
  ) {}

  /**
   * Transformes the givne new warehouse transfer DTO to model.
   * @param   {ICreateWarehouseTransferDTO} warehouseTransferDTO
   * @returns {IWarehouseTransfer}
   */
  private transformDTOToModel = async (
    warehouseTransferDTO: ICreateWarehouseTransferDTO,
  ): Promise<ModelObject<WarehouseTransfer>> => {
    const entries = await this.transformEntries(
      warehouseTransferDTO,
      warehouseTransferDTO.entries,
    );
    // Retrieves the auto-increment the warehouse transfer number.
    const autoNextNumber = this.autoIncrementOrders.getNextTransferNumber();

    // Warehouse transfer order transaction number.
    const transactionNumber =
      warehouseTransferDTO.transactionNumber || autoNextNumber;

    return {
      ...omit(warehouseTransferDTO, ['transferDelivered', 'transferInitiated']),
      transactionNumber,
      ...(warehouseTransferDTO.transferDelivered
        ? {
            transferDeliveredAt: new Date(),
          }
        : {}),
      ...(warehouseTransferDTO.transferDelivered ||
      warehouseTransferDTO.transferInitiated
        ? {
            transferInitiatedAt: new Date(),
          }
        : {}),
      entries,
    };
  };

  /**
   * Assoc average cost to the entry that has no cost.
   * @param {Promise<Map<number, IInventoryItemCostMeta>} inventoryItemsCostMap -
   * @param {IWarehouseTransferEntryDTO} entry -
   */
  private transformEntryAssocAverageCost = R.curry(
    (
      inventoryItemsCostMap: Map<number, IInventoryItemCostMeta>,
      entry: IWarehouseTransferEntryDTO,
    ): IWarehouseTransferEntryDTO => {
      const itemValuation = inventoryItemsCostMap.get(entry.itemId);
      const itemCost = get(itemValuation, 'average', 0);

      return isNumber(entry.cost) ? entry : R.assoc('cost', itemCost, entry);
    },
  );

  /**
   * Transformes warehouse transfer entries.
   * @param {ICreateWarehouseTransferDTO} warehouseTransferDTO
   * @param {IWarehouseTransferEntryDTO[]} entries
   * @returns {Promise<IWarehouseTransferEntryDTO[]>}
   */
  public transformEntries = async (
    warehouseTransferDTO: ICreateWarehouseTransferDTO,
    entries: IWarehouseTransferEntryDTO[],
  ): Promise<ModelObject<WarehouseTransferEntry>[]> => {
    const inventoryItemsIds = warehouseTransferDTO.entries.map((e) => e.itemId);

    // Retrieves the inventory items valuation map.
    const inventoryItemsCostMap =
      await this.inventoryItemCost.getItemsInventoryValuation(
        inventoryItemsIds,
        warehouseTransferDTO.date,
      );
    // Assoc average cost to the entry.
    const assocAverageCost = this.transformEntryAssocAverageCost(
      inventoryItemsCostMap,
    );
    return entries.map((entry) => assocAverageCost(entry));
  };

  /**
   * Authorize warehouse transfer before creating.
   * @param {number} tenantId
   * @param {ICreateWarehouseTransferDTO} warehouseTransferDTO
   */
  public authorize = async (
    warehouseTransferDTO: ICreateWarehouseTransferDTO,
  ) => {
    // Validate warehouse from and to should not be the same.
    this.commandWarehouseTransfer.validateWarehouseFromToNotSame(
      warehouseTransferDTO,
    );

    // Retrieves the from warehouse or throw not found service error.
    const fromWarehouse =
      await this.commandWarehouseTransfer.getFromWarehouseOrThrow(
        warehouseTransferDTO.fromWarehouseId,
      );
    // Retrieves the to warehouse or throw not found service error.
    const toWarehouse =
      await this.commandWarehouseTransfer.getToWarehouseOrThrow(
        warehouseTransferDTO.toWarehouseId,
      );
    // Validates the not found entries items ids.
    const items = await this.itemsEntries.validateItemsIdsExistance(
      warehouseTransferDTO.entries,
    );
    // Validate the items entries should be inventory type.
    this.commandWarehouseTransfer.validateItemsShouldBeInventory(items);
  };

  /**
   * Creates a new warehouse transfer transaction.
   * @param {ICreateWarehouseTransferDTO} warehouseDTO -
   * @returns {Promise<ModelObject<WarehouseTransfer>>}
   */
  public createWarehouseTransfer = async (
    warehouseTransferDTO: ICreateWarehouseTransferDTO,
  ): Promise<ModelObject<WarehouseTransfer>> => {
    // Authorize warehouse transfer before creating.
    await this.authorize(warehouseTransferDTO);

    // Transformes the warehouse transfer DTO to model.
    const warehouseTransferModel =
      await this.transformDTOToModel(warehouseTransferDTO);

    // Create warehouse transfer under unit-of-work.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onWarehouseTransferCreate` event.
      await this.eventPublisher.emitAsync(events.warehouseTransfer.onCreate, {
        trx,
        warehouseTransferDTO,
      } as IWarehouseTransferCreate);

      // Stores the warehouse transfer transaction graph to the storage.
      const warehouseTransfer = await this.warehouseTransferModel()
        .query(trx)
        .upsertGraphAndFetch({
          ...warehouseTransferModel,
        });
      // Triggers `onWarehouseTransferCreated` event.
      await this.eventPublisher.emitAsync(events.warehouseTransfer.onCreated, {
        trx,
        warehouseTransfer,
        warehouseTransferDTO,
      } as IWarehouseTransferCreated);

      return warehouseTransfer;
    });
  };
}
