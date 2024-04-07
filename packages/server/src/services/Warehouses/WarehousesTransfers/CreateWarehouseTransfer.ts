import {
  ICreateWarehouseTransferDTO,
  IInventoryItemCostMeta,
  IWarehouseTransfer,
  IWarehouseTransferCreate,
  IWarehouseTransferCreated,
  IWarehouseTransferEntryDTO,
} from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import { InventoryItemCostService } from '@/services/Inventory/InventoryCostsService';
import ItemsEntriesService from '@/services/Items/ItemsEntriesService';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { Knex } from 'knex';
import { get, isNumber, omit } from 'lodash';
import * as R from 'ramda';
import { Inject, Service } from 'typedi';
import { CommandWarehouseTransfer } from './CommandWarehouseTransfer';
import { WarehouseTransferAutoIncrement } from './WarehouseTransferAutoIncrement';

@Service()
export class CreateWarehouseTransfer extends CommandWarehouseTransfer {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private itemsEntries: ItemsEntriesService;

  @Inject()
  private inventoryItemCost: InventoryItemCostService;

  @Inject()
  private autoIncrementOrders: WarehouseTransferAutoIncrement;

  /**
   * Transformes the givne new warehouse transfer DTO to model.
   * @param   {ICreateWarehouseTransferDTO} warehouseTransferDTO
   * @returns {IWarehouseTransfer}
   */
  private transformDTOToModel = async (
    tenantId: number,
    warehouseTransferDTO: ICreateWarehouseTransferDTO,
  ): Promise<IWarehouseTransfer> => {
    const entries = await this.transformEntries(tenantId, warehouseTransferDTO, warehouseTransferDTO.entries);
    // Retrieves the auto-increment the warehouse transfer number.
    const autoNextNumber = this.autoIncrementOrders.getNextTransferNumber(tenantId);

    // Warehouse transfer order transaction number.
    const transactionNumber = warehouseTransferDTO.transactionNumber || autoNextNumber;

    return {
      ...omit(warehouseTransferDTO, ['transferDelivered', 'transferInitiated']),
      transactionNumber,
      ...(warehouseTransferDTO.transferDelivered
        ? {
            transferDeliveredAt: new Date(),
          }
        : {}),
      ...(warehouseTransferDTO.transferDelivered || warehouseTransferDTO.transferInitiated
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
   * @param    {number} tenantId
   * @param    {ICreateWarehouseTransferDTO} warehouseTransferDTO
   * @param    {IWarehouseTransferEntryDTO[]} entries
   * @returns  {Promise<IWarehouseTransferEntryDTO[]>}
   */
  public transformEntries = async (
    tenantId: number,
    warehouseTransferDTO: ICreateWarehouseTransferDTO,
    entries: IWarehouseTransferEntryDTO[],
  ): Promise<IWarehouseTransferEntryDTO[]> => {
    const inventoryItemsIds = warehouseTransferDTO.entries.map((e) => e.itemId);

    // Retrieves the inventory items valuation map.
    const inventoryItemsCostMap = await this.inventoryItemCost.getItemsInventoryValuation(
      tenantId,
      inventoryItemsIds,
      warehouseTransferDTO.date,
    );
    // Assoc average cost to the entry.
    const assocAverageCost = this.transformEntryAssocAverageCost(inventoryItemsCostMap);
    return R.map(assocAverageCost)(entries);
  };

  /**
   * Authorize warehouse transfer before creating.
   * @param {number} tenantId
   * @param {ICreateWarehouseTransferDTO} warehouseTransferDTO
   */
  public authorize = async (tenantId: number, warehouseTransferDTO: ICreateWarehouseTransferDTO) => {
    // Validate warehouse from and to should not be the same.
    this.validateWarehouseFromToNotSame(warehouseTransferDTO);

    // Retrieves the from warehouse or throw not found service error.
    const fromWarehouse = await this.getFromWarehouseOrThrow(tenantId, warehouseTransferDTO.fromWarehouseId);
    // Retrieves the to warehouse or throw not found service error.
    const toWarehouse = await this.getToWarehouseOrThrow(tenantId, warehouseTransferDTO.toWarehouseId);
    // Validates the not found entries items ids.
    const items = await this.itemsEntries.validateItemsIdsExistance(tenantId, warehouseTransferDTO.entries);
    // Validate the items entries should be inventory type.
    this.validateItemsShouldBeInventory(items);
  };

  /**
   * Creates a new warehouse transfer transaction.
   * @param   {number} tenantId -
   * @param   {ICreateWarehouseTransferDTO} warehouseDTO -
   * @returns {Promise<IWarehouseTransferCreate>}
   */
  public createWarehouseTransfer = async (
    tenantId: number,
    warehouseTransferDTO: ICreateWarehouseTransferDTO,
  ): Promise<IWarehouseTransfer> => {
    const { WarehouseTransfer } = this.tenancy.models(tenantId);

    // Authorize warehouse transfer before creating.
    await this.authorize(tenantId, warehouseTransferDTO);

    // Transformes the warehouse transfer DTO to model.
    const warehouseTransferModel = await this.transformDTOToModel(tenantId, warehouseTransferDTO);
    // Create warehouse transfer under unit-of-work.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onWarehouseTransferCreate` event.
      await this.eventPublisher.emitAsync(events.warehouseTransfer.onCreate, {
        trx,
        warehouseTransferDTO,
        tenantId,
      } as IWarehouseTransferCreate);

      // Stores the warehouse transfer transaction graph to the storage.
      const warehouseTransfer = await WarehouseTransfer.query(trx).upsertGraphAndFetch({
        ...warehouseTransferModel,
      });
      // Triggers `onWarehouseTransferCreated` event.
      await this.eventPublisher.emitAsync(events.warehouseTransfer.onCreated, {
        trx,
        warehouseTransfer,
        warehouseTransferDTO,
        tenantId,
      } as IWarehouseTransferCreated);

      return warehouseTransfer;
    });
  };
}
