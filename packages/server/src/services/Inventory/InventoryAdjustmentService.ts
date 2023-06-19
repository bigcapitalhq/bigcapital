import { Inject, Service } from 'typedi';
import { omit } from 'lodash';
import moment from 'moment';
import * as R from 'ramda';
import { Knex } from 'knex';
import { ServiceError } from '@/exceptions';
import {
  IQuickInventoryAdjustmentDTO,
  IInventoryAdjustment,
  IPaginationMeta,
  IInventoryAdjustmentsFilter,
  ISystemUser,
  IInventoryTransaction,
  IInventoryAdjustmentEventCreatedPayload,
  IInventoryAdjustmentEventPublishedPayload,
  IInventoryAdjustmentEventDeletedPayload,
  IInventoryAdjustmentCreatingPayload,
  IInventoryAdjustmentDeletingPayload,
  IInventoryAdjustmentPublishingPayload,
} from '@/interfaces';
import events from '@/subscribers/events';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import InventoryService from './Inventory';
import UnitOfWork from '@/services/UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import InventoryAdjustmentTransformer from './InventoryAdjustmentTransformer';
import { BranchTransactionDTOTransform } from '@/services/Branches/Integrations/BranchTransactionDTOTransform';
import { WarehouseTransactionDTOTransform } from '@/services/Warehouses/Integrations/WarehouseTransactionDTOTransform';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';

const ERRORS = {
  INVENTORY_ADJUSTMENT_NOT_FOUND: 'INVENTORY_ADJUSTMENT_NOT_FOUND',
  ITEM_SHOULD_BE_INVENTORY_TYPE: 'ITEM_SHOULD_BE_INVENTORY_TYPE',
  INVENTORY_ADJUSTMENT_ALREADY_PUBLISHED:
    'INVENTORY_ADJUSTMENT_ALREADY_PUBLISHED',
};

@Service()
export default class InventoryAdjustmentService {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private inventoryService: InventoryService;

  @Inject()
  private dynamicListService: DynamicListingService;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private branchDTOTransform: BranchTransactionDTOTransform;

  @Inject()
  private warehouseDTOTransform: WarehouseTransactionDTOTransform;

  @Inject()
  private transfromer: TransformerInjectable;

  /**
   * Transformes the quick inventory adjustment DTO to model object.
   * @param  {IQuickInventoryAdjustmentDTO} adjustmentDTO -
   * @return {IInventoryAdjustment}
   */
  private transformQuickAdjToModel(
    tenantId: number,
    adjustmentDTO: IQuickInventoryAdjustmentDTO,
    authorizedUser: ISystemUser
  ): IInventoryAdjustment {
    const entries = [
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
    ];
    const initialDTO = {
      ...omit(adjustmentDTO, ['quantity', 'cost', 'itemId', 'publish']),
      userId: authorizedUser.id,
      ...(adjustmentDTO.publish
        ? {
            publishedAt: moment().toMySqlDateTime(),
          }
        : {}),
      entries,
    };
    return R.compose(
      this.warehouseDTOTransform.transformDTO<IInventoryAdjustment>(tenantId),
      this.branchDTOTransform.transformDTO<IInventoryAdjustment>(tenantId)
    )(initialDTO);
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
   * @param {IQuickInventoryAdjustmentDTO} quickAdjustmentDTO - quick adjustment DTO.
   */
  public async createQuickAdjustment(
    tenantId: number,
    quickAdjustmentDTO: IQuickInventoryAdjustmentDTO,
    authorizedUser: ISystemUser
  ): Promise<IInventoryAdjustment> {
    const { InventoryAdjustment, Account, Item } =
      this.tenancy.models(tenantId);

    // Retrieve the adjustment account or throw not found error.
    const adjustmentAccount = await Account.query()
      .findById(quickAdjustmentDTO.adjustmentAccountId)
      .throwIfNotFound();

    // Retrieve the item model or throw not found service error.
    const item = await Item.query()
      .findById(quickAdjustmentDTO.itemId)
      .throwIfNotFound();

    // Validate item inventory type.
    this.validateItemInventoryType(item);

    // Transform the DTO to inventory adjustment model.
    const invAdjustmentObject = this.transformQuickAdjToModel(
      tenantId,
      quickAdjustmentDTO,
      authorizedUser
    );
    // Writes inventory adjustment transaction with associated transactions
    // under unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onInventoryAdjustmentCreating` event.
      await this.eventPublisher.emitAsync(
        events.inventoryAdjustment.onQuickCreating,
        {
          tenantId,
          trx,
          quickAdjustmentDTO,
        } as IInventoryAdjustmentCreatingPayload
      );
      // Saves the inventory adjustment with associated entries to the storage.
      const inventoryAdjustment = await InventoryAdjustment.query(
        trx
      ).upsertGraph({
        ...invAdjustmentObject,
      });
      // Triggers `onInventoryAdjustmentQuickCreated` event.
      await this.eventPublisher.emitAsync(
        events.inventoryAdjustment.onQuickCreated,
        {
          tenantId,
          inventoryAdjustment,
          inventoryAdjustmentId: inventoryAdjustment.id,
          trx,
        } as IInventoryAdjustmentEventCreatedPayload
      );
      return inventoryAdjustment;
    });
  }

  /**
   * Deletes the inventory adjustment transaction.
   * @param {number} tenantId - Tenant id.
   * @param {number} inventoryAdjustmentId - Inventory adjustment id.
   */
  public async deleteInventoryAdjustment(
    tenantId: number,
    inventoryAdjustmentId: number
  ): Promise<void> {
    const { InventoryAdjustmentEntry, InventoryAdjustment } =
      this.tenancy.models(tenantId);

    // Retrieve the inventory adjustment or throw not found service error.
    const oldInventoryAdjustment =
      await this.getInventoryAdjustmentOrThrowError(
        tenantId,
        inventoryAdjustmentId
      );
    // Deletes the inventory adjustment transaction and associated transactions
    // under unit-of-work env.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onInventoryAdjustmentDeleting` event.
      await this.eventPublisher.emitAsync(
        events.inventoryAdjustment.onDeleting,
        {
          trx,
          oldInventoryAdjustment,
          tenantId,
        } as IInventoryAdjustmentDeletingPayload
      );

      // Deletes the inventory adjustment entries.
      await InventoryAdjustmentEntry.query(trx)
        .where('adjustment_id', inventoryAdjustmentId)
        .delete();

      // Deletes the inventory adjustment transaction.
      await InventoryAdjustment.query(trx)
        .findById(inventoryAdjustmentId)
        .delete();

      // Triggers `onInventoryAdjustmentDeleted` event.
      await this.eventPublisher.emitAsync(
        events.inventoryAdjustment.onDeleted,
        {
          tenantId,
          inventoryAdjustmentId,
          oldInventoryAdjustment,
          trx,
        } as IInventoryAdjustmentEventDeletedPayload
      );
    });
  }

  /**
   * Publish the inventory adjustment transaction.
   * @param {number} tenantId
   * @param {number} inventoryAdjustmentId
   */
  public async publishInventoryAdjustment(
    tenantId: number,
    inventoryAdjustmentId: number
  ): Promise<void> {
    const { InventoryAdjustment } = this.tenancy.models(tenantId);

    // Retrieve the inventory adjustment or throw not found service error.
    const oldInventoryAdjustment =
      await this.getInventoryAdjustmentOrThrowError(
        tenantId,
        inventoryAdjustmentId
      );

    // Validate adjustment not already published.
    this.validateAdjustmentTransactionsNotPublished(oldInventoryAdjustment);

    // Publishes inventory adjustment with associated inventory transactions
    // under unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      await this.eventPublisher.emitAsync(
        events.inventoryAdjustment.onPublishing,
        {
          trx,
          tenantId,
          oldInventoryAdjustment,
        } as IInventoryAdjustmentPublishingPayload
      );

      // Publish the inventory adjustment transaction.
      await InventoryAdjustment.query().findById(inventoryAdjustmentId).patch({
        publishedAt: moment().toMySqlDateTime(),
      });
      // Retrieve the inventory adjustment after the modification.
      const inventoryAdjustment = await InventoryAdjustment.query()
        .findById(inventoryAdjustmentId)
        .withGraphFetched('entries');

      // Triggers `onInventoryAdjustmentDeleted` event.
      await this.eventPublisher.emitAsync(
        events.inventoryAdjustment.onPublished,
        {
          tenantId,
          inventoryAdjustmentId,
          inventoryAdjustment,
          oldInventoryAdjustment,
          trx,
        } as IInventoryAdjustmentEventPublishedPayload
      );
    });
  }

  /**
   * Parses inventory adjustments list filter DTO.
   * @param filterDTO -
   */
  private parseListFilterDTO(filterDTO) {
    return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
  }

  /**
   * Retrieve the inventory adjustments paginated list.
   * @param {number} tenantId
   * @param {IInventoryAdjustmentsFilter} adjustmentsFilter
   */
  public async getInventoryAdjustments(
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
      filter
    );
    const { results, pagination } = await InventoryAdjustment.query()
      .onBuild((query) => {
        query.withGraphFetched('entries.item');
        query.withGraphFetched('adjustmentAccount');

        dynamicFilter.buildQuery()(query);
      })
      .pagination(filter.page - 1, filter.pageSize);

    // Retrieves the transformed inventory adjustments.
    const inventoryAdjustments = await this.transfromer.transform(
      tenantId,
      results,
      new InventoryAdjustmentTransformer()
    );
    return {
      inventoryAdjustments,
      pagination,
    };
  }

  /**
   * Writes the inventory transactions from the inventory adjustment transaction.
   * @param  {number} tenantId -
   * @param  {IInventoryAdjustment} inventoryAdjustment -
   * @param  {boolean} override -
   * @param  {Knex.Transaction} trx -
   * @return {Promise<void>}
   */
  public async writeInventoryTransactions(
    tenantId: number,
    inventoryAdjustment: IInventoryAdjustment,
    override: boolean = false,
    trx?: Knex.Transaction
  ): Promise<void> {
    const commonTransaction = {
      direction: inventoryAdjustment.inventoryDirection,
      date: inventoryAdjustment.date,
      transactionType: 'InventoryAdjustment',
      transactionId: inventoryAdjustment.id,
      createdAt: inventoryAdjustment.createdAt,
      costAccountId: inventoryAdjustment.adjustmentAccountId,

      branchId: inventoryAdjustment.branchId,
      warehouseId: inventoryAdjustment.warehouseId,
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
      override,
      trx
    );
  }

  /**
   * Reverts the inventory transactions from the inventory adjustment transaction.
   * @param {number} tenantId
   * @param {number} inventoryAdjustmentId
   */
  async revertInventoryTransactions(
    tenantId: number,
    inventoryAdjustmentId: number,
    trx?: Knex.Transaction
  ): Promise<{ oldInventoryTransactions: IInventoryTransaction[] }> {
    return this.inventoryService.deleteInventoryTransactions(
      tenantId,
      inventoryAdjustmentId,
      'InventoryAdjustment',
      trx
    );
  }

  /**
   * Retrieve specific inventory adjustment transaction details.
   * @param {number} tenantId
   * @param {number} inventoryAdjustmentId
   */
  async getInventoryAdjustment(
    tenantId: number,
    inventoryAdjustmentId: number
  ) {
    const { InventoryAdjustment } = this.tenancy.models(tenantId);

    // Retrieve inventory adjustment transation with associated models.
    const inventoryAdjustment = await InventoryAdjustment.query()
      .findById(inventoryAdjustmentId)
      .withGraphFetched('entries.item')
      .withGraphFetched('adjustmentAccount');

    // Throw not found if the given adjustment transaction not exists.
    this.throwIfAdjustmentNotFound(inventoryAdjustment);

    return this.transfromer.transform(
      tenantId,
      inventoryAdjustment,
      new InventoryAdjustmentTransformer()
    );
  }

  /**
   * Validate the adjustment transaction is exists.
   * @param {IInventoryAdjustment} inventoryAdjustment
   */
  private throwIfAdjustmentNotFound(inventoryAdjustment: IInventoryAdjustment) {
    if (!inventoryAdjustment) {
      throw new ServiceError(ERRORS.INVENTORY_ADJUSTMENT_NOT_FOUND);
    }
  }

  /**
   * Validates the adjustment transaction is not already published.
   * @param {IInventoryAdjustment} oldInventoryAdjustment
   */
  private validateAdjustmentTransactionsNotPublished(
    oldInventoryAdjustment: IInventoryAdjustment
  ) {
    if (oldInventoryAdjustment.isPublished) {
      throw new ServiceError(ERRORS.INVENTORY_ADJUSTMENT_ALREADY_PUBLISHED);
    }
  }
}
