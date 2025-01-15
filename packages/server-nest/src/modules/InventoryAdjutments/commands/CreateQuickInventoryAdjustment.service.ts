import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import * as R from 'ramda';
import * as moment from 'moment';
import { omit } from 'lodash';
import { events } from '@/common/events/events';
import { InventoryAdjustment } from '../models/InventoryAdjustment';
import {
  IInventoryAdjustmentCreatingPayload,
  IInventoryAdjustmentEventCreatedPayload,
  IQuickInventoryAdjustmentDTO,
} from '../types/InventoryAdjustments.types';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ServiceError } from '@/modules/Items/ServiceError';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { Item } from '@/modules/Items/models/Item';
import { Account } from '@/modules/Accounts/models/Account.model';
import { BranchTransactionDTOTransformer } from '@/modules/Branches/integrations/BranchTransactionDTOTransform';
import { WarehouseTransactionDTOTransform } from '@/modules/Warehouses/Integrations/WarehouseTransactionDTOTransform';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { ERRORS } from '../constants/InventoryAdjustments.constants';

@Injectable()
export class CreateQuickInventoryAdjustmentService {
  constructor(
    @Inject(InventoryAdjustment.name)
    private readonly inventoryAdjustmentModel: typeof InventoryAdjustment,

    @Inject(Item.name)
    private readonly itemModel: typeof Item,

    @Inject(Account.name)
    private readonly accountModel: typeof Account,

    private readonly tenancyContext: TenancyContext,
    private readonly eventEmitter: EventEmitter2,
    private readonly uow: UnitOfWork,
    private readonly warehouseDTOTransform: WarehouseTransactionDTOTransform,
    private readonly branchDTOTransform: BranchTransactionDTOTransformer,
  ) {}

  /**
   * Transformes the quick inventory adjustment DTO to model object.
   * @param  {IQuickInventoryAdjustmentDTO} adjustmentDTO -
   * @return {IInventoryAdjustment}
   */
  private async transformQuickAdjToModel(
    adjustmentDTO: IQuickInventoryAdjustmentDTO,
  ): Promise<InventoryAdjustment> {
    const authorizedUser = await this.tenancyContext.getSystemUser();
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
      this.warehouseDTOTransform.transformDTO<InventoryAdjustment>,
      this.branchDTOTransform.transformDTO<InventoryAdjustment>,
    )(initialDTO) as InventoryAdjustment;
  }

  /**
   * Creates a quick inventory adjustment for specific item.
   * @param {IQuickInventoryAdjustmentDTO} quickAdjustmentDTO - qucik adjustment DTO.
   */
  public async createQuickAdjustment(
    quickAdjustmentDTO: IQuickInventoryAdjustmentDTO,
  ): Promise<InventoryAdjustment> {
    // Retrieve the adjustment account or throw not found error.
    const adjustmentAccount = await this.accountModel
      .query()
      .findById(quickAdjustmentDTO.adjustmentAccountId)
      .throwIfNotFound();

    // Retrieve the item model or throw not found service error.
    const item = await this.itemModel
      .query()
      .findById(quickAdjustmentDTO.itemId)
      .throwIfNotFound();

    // Validate item inventory type.
    this.validateItemInventoryType(item);

    // Transform the DTO to inventory adjustment model.
    const invAdjustmentObject =
      await this.transformQuickAdjToModel(quickAdjustmentDTO);

    // Writes inventory adjustment transaction with associated transactions
    // under unit-of-work envirment.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onInventoryAdjustmentCreating` event.
      await this.eventEmitter.emitAsync(
        events.inventoryAdjustment.onQuickCreating,
        {
          quickAdjustmentDTO,
          trx,
        } as IInventoryAdjustmentCreatingPayload,
      );
      // Saves the inventory adjustment with associated entries to the storage.
      const inventoryAdjustment = await this.inventoryAdjustmentModel
        .query(trx)
        .upsertGraphAndFetch({
          ...invAdjustmentObject,
        });
      // Triggers `onInventoryAdjustmentQuickCreated` event.
      await this.eventEmitter.emitAsync(
        events.inventoryAdjustment.onQuickCreated,
        {
          inventoryAdjustment,
          inventoryAdjustmentId: inventoryAdjustment.id,
          trx,
        } as IInventoryAdjustmentEventCreatedPayload,
      );
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
