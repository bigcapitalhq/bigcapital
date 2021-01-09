import { Inject, Service } from 'typedi';
import { omit } from 'lodash';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from 'decorators/eventDispatcher';
import { ServiceError } from 'exceptions';
import {
  IQuickInventoryAdjustmentDTO,
  IInventoryAdjustment,
  IPaginationMeta,
  IInventoryAdjustmentsFilter
} from 'interfaces';
import events from 'subscribers/events';
import AccountsService from 'services/Accounts/AccountsService';
import ItemsService from 'services/Items/ItemsService';
import HasTenancyService from 'services/Tenancy/TenancyService';

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

  /**
   * Transformes the quick inventory adjustment DTO to model object.
   * @param {IQuickInventoryAdjustmentDTO} adjustmentDTO -
   * @return {IInventoryAdjustment}
   */
  transformQuickAdjToModel(
    adjustmentDTO: IQuickInventoryAdjustmentDTO
  ): IInventoryAdjustment {
    return {
      ...omit(adjustmentDTO, ['newQuantity', 'newCost', 'itemId']),
      entries: [
        {
          index: 1,
          itemId: adjustmentDTO.itemId,
          newQuantity: adjustmentDTO.newQuantity,
          newCost: adjustmentDTO.newCost,
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
    quickAdjustmentDTO: IQuickInventoryAdjustmentDTO
  ) {
    const { InventoryAdjustment } = this.tenancy.models(tenantId);

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
      quickAdjustmentDTO
    );

    await InventoryAdjustment.query().upsertGraph({
      ...invAdjustmentObject,
    });
    // Triggers `onInventoryAdjustmentQuickCreated` event.
    await this.eventDispatcher.dispatch(
      events.inventoryAdjustment.onQuickCreated,
      {
        tenantId,
      }
    );
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
    const adjustment = await this.getInventoryAdjustmentOrThrowError(
      tenantId,
      inventoryAdjustmentId
    );
    const {
      InventoryAdjustmentEntry,
      InventoryAdjustment,
    } = this.tenancy.models(tenantId);

    // Deletes the inventory adjustment entries.
    await InventoryAdjustmentEntry.query()
      .where('adjustment_id', inventoryAdjustmentId)
      .delete();

    // Deletes the inventory adjustment transaction.
    await InventoryAdjustment.query().findById(inventoryAdjustmentId).delete();

    // Triggers `onInventoryAdjustmentDeleted` event.
    await this.eventDispatcher.dispatch(events.inventoryAdjustment.onDeleted, {
      tenantId,
    });
  }

  /**
   * Retrieve the inventory adjustments paginated list.
   * @param {number} tenantId 
   * @param {IInventoryAdjustmentsFilter} adjustmentsFilter 
   */
  async getInventoryAdjustments(
    tenantId: number,
    adjustmentsFilter: IInventoryAdjustmentsFilter
  ): Promise<{
    inventoryAdjustments: IInventoryAdjustment[];
    pagination: IPaginationMeta;
  }> {
    const { InventoryAdjustment } = this.tenancy.models(tenantId);

    const { results, pagination } = await InventoryAdjustment.query()
      .withGraphFetched('entries')
      .pagination(adjustmentsFilter.page - 1, adjustmentsFilter.pageSize);

    return {
      inventoryAdjustments: results,
      pagination,
    };
  }
}
