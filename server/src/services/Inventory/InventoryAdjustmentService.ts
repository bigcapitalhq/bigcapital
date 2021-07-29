import { Inject, Service } from 'typedi';
import { omit } from 'lodash';
import moment from 'moment';
import * as R from 'ramda';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from 'decorators/eventDispatcher';
import { ServiceError } from 'exceptions';
import {
  IQuickInventoryAdjustmentDTO,
  IInventoryAdjustment,
  IPaginationMeta,
  IInventoryAdjustmentsFilter,
  ISystemUser,
  IInventoryTransaction,
} from 'interfaces';
import events from 'subscribers/events';
import AccountsService from 'services/Accounts/AccountsService';
import ItemsService from 'services/Items/ItemsService';
import DynamicListingService from 'services/DynamicListing/DynamicListService';
import HasTenancyService from 'services/Tenancy/TenancyService';
import InventoryService from './Inventory';

const ERRORS = {
  INVENTORY_ADJUSTMENT_NOT_FOUND: 'INVENTORY_ADJUSTMENT_NOT_FOUND',
  ITEM_SHOULD_BE_INVENTORY_TYPE: 'ITEM_SHOULD_BE_INVENTORY_TYPE',
};

@Service()
export default class InventoryAdjustmentService {
  @Inject()
  itemsService: ItemsService;

  @Inject()
  accountsService: AccountsService;

  @Inject()
  tenancy: HasTenancyService;

  @Inject('logger')
  logger: any;

  @EventDispatcher()
  eventDispatcher: EventDispatcherInterface;

  @Inject()
  inventoryService: InventoryService;

  @Inject()
  dynamicListService: DynamicListingService;

  /**
   * Transformes the quick inventory adjustment DTO to model object.
   * @param {IQuickInventoryAdjustmentDTO} adjustmentDTO -
   * @return {IInventoryAdjustment}
   */
  transformQuickAdjToModel(
    adjustmentDTO: IQuickInventoryAdjustmentDTO,
    authorizedUser: ISystemUser
  ): IInventoryAdjustment {
    return {
      ...omit(adjustmentDTO, ['quantity', 'cost', 'itemId', 'publish']),
      userId: authorizedUser.id,
      ...(adjustmentDTO.publish
        ? {
            publishedAt: moment().toMySqlDateTime(),
          }
        : {}),
      entries: [
        {
          index: 1,
          itemId: adjustmentDTO.itemId,
          ...('increment' === adjustmentDTO.type
            ? {
                quantity: adjustmentDTO.quantity,
                cost: adjustmentDTO.cost,
              }
            : {}),
          ...('decrement' === adjustmentDTO.type
            ? {
                quantity: adjustmentDTO.quantity,
              }
            : {}),
        },
      ],
    };
  }

  /**
   * Validate the item inventory type.
   * @param {IItem} item
   */
  validateItemInventoryType(item) {
    if (item.type !== 'inventory') {
      throw new ServiceError(ERRORS.ITEM_SHOULD_BE_INVENTORY_TYPE);
    }
  }

  /**
   * Retrieve the inventory adjustment or throw not found service error.
   * @param {number} tenantId -
   * @param {number} adjustmentId -
   */
  async getInventoryAdjustmentOrThrowError(
    tenantId: number,
    adjustmentId: number
  ) {
    const { InventoryAdjustment } = this.tenancy.models(tenantId);

    const inventoryAdjustment = await InventoryAdjustment.query()
      .findById(adjustmentId)
      .withGraphFetched('entries');

    if (!inventoryAdjustment) {
      throw new ServiceError(ERRORS.INVENTORY_ADJUSTMENT_NOT_FOUND);
    }
    return inventoryAdjustment;
  }

  /**
   * Creates a quick inventory adjustment for specific item.
   * @param {number} tenantId - Tenant id.
   * @param {IQuickInventoryAdjustmentDTO} quickAdjustmentDTO - qucik adjustment DTO.
   */
  async createQuickAdjustment(
    tenantId: number,
    quickAdjustmentDTO: IQuickInventoryAdjustmentDTO,
    authorizedUser: ISystemUser
  ): Promise<IInventoryAdjustment> {
    const { InventoryAdjustment } = this.tenancy.models(tenantId);

    this.logger.info(
      '[inventory_adjustment] trying to create quick adjustment..',
      {
        tenantId,
        quickAdjustmentDTO,
      }
    );
    // Retrieve the adjustment account or throw not found error.
    const adjustmentAccount = await this.accountsService.getAccountOrThrowError(
      tenantId,
      quickAdjustmentDTO.adjustmentAccountId
    );
    // Retrieve the item model or throw not found service error.
    const item = await this.itemsService.getItemOrThrowError(
      tenantId,
      quickAdjustmentDTO.itemId
    );
    // Validate item inventory type.
    this.validateItemInventoryType(item);

    // Transform the DTO to inventory adjustment model.
    const invAdjustmentObject = this.transformQuickAdjToModel(
      quickAdjustmentDTO,
      authorizedUser
    );
    // Saves the inventory adjustment with assocaited entries to the storage.
    const inventoryAdjustment = await InventoryAdjustment.query().upsertGraph({
      ...invAdjustmentObject,
    });
    // Triggers `onInventoryAdjustmentQuickCreated` event.
    await this.eventDispatcher.dispatch(
      events.inventoryAdjustment.onQuickCreated,
      {
        tenantId,
        inventoryAdjustment,
        inventoryAdjustmentId: inventoryAdjustment.id,
      }
    );
    this.logger.info(
      '[inventory_adjustment] quick adjustment created successfully.',
      {
        tenantId,
        quickAdjustmentDTO,
      }
    );
    return inventoryAdjustment;
  }

  /**
   * Deletes the inventory adjustment transaction.
   * @param {number} tenantId - Tenant id.
   * @param {number} inventoryAdjustmentId - Inventory adjustment id.
   */
  async deleteInventoryAdjustment(
    tenantId: number,
    inventoryAdjustmentId: number
  ): Promise<void> {
    // Retrieve the inventory adjustment or throw not found service error.
    const oldInventoryAdjustment = await this.getInventoryAdjustmentOrThrowError(
      tenantId,
      inventoryAdjustmentId
    );
    const {
      InventoryAdjustmentEntry,
      InventoryAdjustment,
    } = this.tenancy.models(tenantId);

    this.logger.info('[inventory_adjustment] trying to delete adjustment.', {
      tenantId,
      inventoryAdjustmentId,
    });
    // Deletes the inventory adjustment entries.
    await InventoryAdjustmentEntry.query()
      .where('adjustment_id', inventoryAdjustmentId)
      .delete();

    // Deletes the inventory adjustment transaction.
    await InventoryAdjustment.query().findById(inventoryAdjustmentId).delete();

    // Triggers `onInventoryAdjustmentDeleted` event.
    await this.eventDispatcher.dispatch(events.inventoryAdjustment.onDeleted, {
      tenantId,
      inventoryAdjustmentId,
      oldInventoryAdjustment,
    });
    this.logger.info(
      '[inventory_adjustment] the adjustment deleted successfully.',
      {
        tenantId,
        inventoryAdjustmentId,
      }
    );
  }

  /**
   * Publish the inventory adjustment transaction.
   * @param {number} tenantId
   * @param {number} inventoryAdjustmentId
   */
  async publishInventoryAdjustment(
    tenantId: number,
    inventoryAdjustmentId: number
  ): Promise<void> {
    const { InventoryAdjustment } = this.tenancy.models(tenantId);

    // Retrieve the inventory adjustment or throw not found service error.
    const oldInventoryAdjustment = await this.getInventoryAdjustmentOrThrowError(
      tenantId,
      inventoryAdjustmentId
    );
    this.logger.info('[inventory_adjustment] trying to publish adjustment.', {
      tenantId,
      inventoryAdjustmentId,
    });
    // Publish the inventory adjustment transaction.
    await InventoryAdjustment.query().findById(inventoryAdjustmentId).patch({
      publishedAt: moment().toMySqlDateTime(),
    });

    // Retrieve the inventory adjustment after the modification.
    const inventoryAdjustment = await InventoryAdjustment.query()
      .findById(inventoryAdjustmentId)
      .withGraphFetched('entries');

    // Triggers `onInventoryAdjustmentDeleted` event.
    await this.eventDispatcher.dispatch(
      events.inventoryAdjustment.onPublished,
      {
        tenantId,
        inventoryAdjustmentId,
        inventoryAdjustment,
        oldInventoryAdjustment,
      }
    );
  }

  /**
   * Parses inventory adjustments list filter DTO.
   * @param filterDTO 
   * @returns 
   */
  private parseListFilterDTO(filterDTO) {
    return R.compose(
      this.dynamicListService.parseStringifiedFilter,
    )(filterDTO);
  }

  /**
   * Retrieve the inventory adjustments paginated list.
   * @param {number} tenantId
   * @param {IInventoryAdjustmentsFilter} adjustmentsFilter
   */
  async getInventoryAdjustments(
    tenantId: number,
    filterDTO: IInventoryAdjustmentsFilter
  ): Promise<{
    inventoryAdjustments: IInventoryAdjustment[];
    pagination: IPaginationMeta;
  }> {
    const { InventoryAdjustment } = this.tenancy.models(tenantId);

    // Parses inventory adjustments list filter DTO.
    const filter = this.parseListFilterDTO(filterDTO);

    // Dynamic list service.
    const dynamicFilter = await this.dynamicListService.dynamicList(
      tenantId,
      InventoryAdjustment,
      filter,
    );
    const { results, pagination } = await InventoryAdjustment.query()
      .onBuild((query) => {
        query.withGraphFetched('entries.item');
        query.withGraphFetched('adjustmentAccount');

        dynamicFilter.buildQuery()(query);
      })
      .pagination(filter.page - 1, filter.pageSize);

    return {
      inventoryAdjustments: results,
      pagination,
    };
  }

  /**
   * Writes the inventory transactions from the inventory adjustment transaction.
   * @param  {number} tenantId
   * @param  {IInventoryAdjustment} inventoryAdjustment
   * @return {Promise<void>}
   */
  async writeInventoryTransactions(
    tenantId: number,
    inventoryAdjustment: IInventoryAdjustment,
    override: boolean = false
  ): Promise<void> {
    const commonTransaction = {
      direction: inventoryAdjustment.inventoryDirection,
      date: inventoryAdjustment.date,
      transactionType: 'InventoryAdjustment',
      transactionId: inventoryAdjustment.id,
      createdAt: inventoryAdjustment.createdAt
    };
    const inventoryTransactions = [];
    
    inventoryAdjustment.entries.forEach((entry) => {
      inventoryTransactions.push({
        ...commonTransaction,
        itemId: entry.itemId,
        quantity: entry.quantity,
        rate: entry.cost,
      });
    });
    // Saves the given inventory transactions to the storage.
    await this.inventoryService.recordInventoryTransactions(
      tenantId,
      inventoryTransactions,
      override
    )
  }

  /**
   * Reverts the inventory transactions from the inventory adjustment transaction.
   * @param {number} tenantId
   * @param {number} inventoryAdjustmentId
   */
  async revertInventoryTransactions(
    tenantId: number,
    inventoryAdjustmentId: number
  ): Promise<{ oldInventoryTransactions: IInventoryTransaction[] }> {
    return this.inventoryService.deleteInventoryTransactions(
      tenantId,
      inventoryAdjustmentId,
      'InventoryAdjustment'
    );
  }
}
