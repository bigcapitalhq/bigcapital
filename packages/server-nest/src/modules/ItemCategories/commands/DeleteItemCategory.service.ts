import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { CommandItemCategoryValidatorService } from './CommandItemCategoryValidator.service';
import { ItemCategory } from '../models/ItemCategory.model';
import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { IItemCategoryDeletedPayload } from '../ItemCategory.interfaces';
import { Item } from '@/modules/Items/models/Item';

@Injectable()
export class DeleteItemCategoryService {
  /**
   * @param {UnitOfWork} uow - Unit of work.
   * @param {CommandItemCategoryValidatorService} validator - Command item category validator service.
   * @param {EventEmitter2} eventEmitter - Event emitter.
   * @param {typeof ItemCategory} itemCategoryModel - Item category model.
   */
  constructor(
    private readonly uow: UnitOfWork,
    private readonly validator: CommandItemCategoryValidatorService,
    private readonly eventEmitter: EventEmitter2,
    @Inject(ItemCategory.name)
    private readonly itemCategoryModel: typeof ItemCategory,

    @Inject(Item.name)
    private readonly itemModel: typeof Item,
  ) {}

  /**
   * Deletes the given item category.
   * @param {number} tenantId - Tenant id.
   * @param {number} itemCategoryId - Item category id.
   * @return {Promise<void>}
   */
  public async deleteItemCategory(itemCategoryId: number) {
    // Retrieve item category or throw not found error.
    const oldItemCategory = await this.itemCategoryModel
      .query()
      .findById(itemCategoryId)
      .throwIfNotFound();

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Unassociate items with item category.
      await this.unassociateItemsWithCategories(itemCategoryId, trx);

      // Delete item category.
      await ItemCategory.query(trx).findById(itemCategoryId).delete();

      // Triggers `onItemCategoryDeleted` event.
      await this.eventEmitter.emitAsync(events.itemCategory.onDeleted, {
        itemCategoryId,
        oldItemCategory,
      } as IItemCategoryDeletedPayload);
    });
  }

  /**
   * Unlink items relations with item categories.
   * @param {number|number[]} itemCategoryId -
   * @return {Promise<void>}
   */
  private async unassociateItemsWithCategories(
    itemCategoryId: number | number[],
    trx?: Knex.Transaction,
  ): Promise<void> {
    const ids = Array.isArray(itemCategoryId)
      ? itemCategoryId
      : [itemCategoryId];

    await this.itemModel.query(trx)
      .whereIn('category_id', ids)
      .patch({ categoryId: null });
  }
}
