import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import * as composeAsync from 'async/compose';
import { omit } from 'lodash';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { ServiceError } from '@/modules/Items/ServiceError';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { Item } from '@/modules/Items/models/Item';
import { Account } from '@/modules/Accounts/models/Account.model';
import { BranchTransactionDTOTransformer } from '@/modules/Branches/integrations/BranchTransactionDTOTransform';
import { WarehouseTransactionDTOTransform } from '@/modules/Warehouses/Integrations/WarehouseTransactionDTOTransform';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { formatDateFields } from '@/utils/format-date-fields';
import { InventoryAdjustment } from '../models/InventoryAdjustment';
import { EditQuickInventoryAdjustmentDto } from '../dtos/EditQuickInventoryAdjustment.dto';
import {
  IInventoryAdjustmentEditedPayload,
  IInventoryAdjustmentEditingPayload,
} from '../types/InventoryAdjustments.types';
import { ERRORS } from '../constants/InventoryAdjustments.constants';

@Injectable()
export class EditQuickInventoryAdjustmentService {
  constructor(
    @Inject(InventoryAdjustment.name)
    private readonly inventoryAdjustmentModel: TenantModelProxy<
      typeof InventoryAdjustment
    >,

    @Inject(Item.name)
    private readonly itemModel: TenantModelProxy<typeof Item>,

    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,

    private readonly eventEmitter: EventEmitter2,
    private readonly uow: UnitOfWork,
    private readonly warehouseDTOTransform: WarehouseTransactionDTOTransform,
    private readonly branchDTOTransform: BranchTransactionDTOTransformer,
  ) {}

  /**
   * Transformes the quick inventory adjustment DTO to model object.
   * @param {EditQuickInventoryAdjustmentDto} adjustmentDTO -
   * @param {InventoryAdjustment} oldInventoryAdjustment -
   * @return {Promise<InventoryAdjustment>}
   */
  private async transformQuickAdjToModel(
    adjustmentDTO: EditQuickInventoryAdjustmentDto,
    oldInventoryAdjustment: InventoryAdjustment,
  ): Promise<InventoryAdjustment> {
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
      ...formatDateFields(
        omit(adjustmentDTO, ['quantity', 'cost', 'itemId', 'publish']),
        ['date'],
      ),
      // Publishing is a one-way action; keep the original published state
      // and only set the published date when publishing a draft adjustment.
      publishedAt: oldInventoryAdjustment.isPublished
        ? oldInventoryAdjustment.publishedAt
        : adjustmentDTO.publish
          ? moment().toMySqlDateTime()
          : null,
      entries,
    };
    return composeAsync(
      this.warehouseDTOTransform.transformDTO<InventoryAdjustment>,
      this.branchDTOTransform.transformDTO<InventoryAdjustment>,
    )(initialDTO) as InventoryAdjustment;
  }

  /**
   * Edits the quick inventory adjustment for specific item.
   * @param {number} inventoryAdjustmentId - Inventory adjustment id.
   * @param {EditQuickInventoryAdjustmentDto} quickAdjustmentDTO - Quick adjustment DTO.
   */
  public async editQuickAdjustment(
    inventoryAdjustmentId: number,
    quickAdjustmentDTO: EditQuickInventoryAdjustmentDto,
  ): Promise<InventoryAdjustment> {
    // Retrieve the item model or throw not found service error.
    const item = await this.itemModel()
      .query()
      .findById(quickAdjustmentDTO.itemId)
      .throwIfNotFound();

    // Validate item inventory type.
    this.validateItemInventoryType(item);

    // Updates the inventory adjustment transaction with associated transactions
    // under unit-of-work envirment.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Retrieve the old inventory adjustment with entries and prevent other
      // transactions from modifying the same row.
      const oldInventoryAdjustment = await this.inventoryAdjustmentModel()
        .query(trx)
        .findById(inventoryAdjustmentId)
        .forUpdate()
        .withGraphFetched('entries')
        .throwIfNotFound();

      // Retrieve the adjustment account or throw not found error.
      await this.accountModel()
        .query(trx)
        .findById(quickAdjustmentDTO.adjustmentAccountId)
        .throwIfNotFound();

      // Transform the DTO to inventory adjustment model.
      const invAdjustmentObject = await this.transformQuickAdjToModel(
        quickAdjustmentDTO,
        oldInventoryAdjustment,
      );

      // Triggers `onInventoryAdjustmentEditing` event.
      await this.eventEmitter.emitAsync(events.inventoryAdjustment.onEditing, {
        oldInventoryAdjustment,
        quickAdjustmentDTO,
        trx,
      } as IInventoryAdjustmentEditingPayload);

      // Saves the inventory adjustment with associated entries to the storage.
      await this.inventoryAdjustmentModel()
        .query(trx)
        .upsertGraphAndFetch({
          id: inventoryAdjustmentId,
          ...invAdjustmentObject,
        });

      // Retrieve the updated inventory adjustment with associated entries.
      const inventoryAdjustment = await this.inventoryAdjustmentModel()
        .query(trx)
        .findById(inventoryAdjustmentId)
        .withGraphFetched('entries');

      // Triggers `onInventoryAdjustmentEdited` event.
      await this.eventEmitter.emitAsync(events.inventoryAdjustment.onEdited, {
        inventoryAdjustment,
        inventoryAdjustmentId,
        oldInventoryAdjustment,
        quickAdjustmentDTO,
        trx,
      } as IInventoryAdjustmentEditedPayload);

      return inventoryAdjustment;
    });
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
}
