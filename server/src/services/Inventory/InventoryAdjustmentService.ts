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
  IInventoryAdjustmentsFilter,
  ISystemUser,
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
    adjustmentDTO: IQuickInventoryAdjustmentDTO,
    authorizedUser: ISystemUser
  ): IInventoryAdjustment {
    return {
      ...omit(adjustmentDTO, ['quantity', 'cost', 'itemId']),
      userId: authorizedUser.id,
      entries: [
        {
          index: 1,
          itemId: adjustmentDTO.itemId,
          ...(['increment', 'decrement'].indexOf(adjustmentDTO.type) !== -1
            ? {
                quantity: adjustmentDTO.quantity,
              }
            : {}),
          ...('increment' === adjustmentDTO.type
            ? {
                cost: adjustmentDTO.cost,
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
    const inventoryAdjustment = await InventoryAdjustment.query().upsertGraph({
      ...invAdjustmentObject,
    });
    // Triggers `onInventoryAdjustmentQuickCreated` event.
    await this.eventDispatcher.dispatch(
      events.inventoryAdjustment.onQuickCreated,
      {
        tenantId,
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
    const adjustment = await this.getInventoryAdjustmentOrThrowError(
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
      .withGraphFetched('entries.item')
      .withGraphFetched('adjustmentAccount')
      .pagination(adjustmentsFilter.page - 1, adjustmentsFilter.pageSize);

    return {
      inventoryAdjustments: results,
      pagination,
    };
  }
}
