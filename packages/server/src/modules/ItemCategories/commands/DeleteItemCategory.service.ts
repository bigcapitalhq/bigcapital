import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { CommandItemCategoryValidatorService } from './CommandItemCategoryValidator.service';
import { ItemCategory } from '../models/ItemCategory.model';
import { events } from '@/common/events/events';
import { IItemCategoryDeletedPayload } from '../ItemCategory.interfaces';
import { Item } from '@/modules/Items/models/Item';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

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
    private readonly itemCategoryModel: TenantModelProxy<typeof ItemCategory>,

    @Inject(Item.name)
    private readonly itemModel: TenantModelProxy<typeof Item>,
  ) {}

  /**
   * Deletes the given item category.
   * @param {number} itemCategoryId - Item category id.
   * @param {Knex.Transaction} trx - Database transaction instance.
   * @return {Promise<void>}
   */
  public async deleteItemCategory(
    itemCategoryId: number,
    trx?: Knex.Transaction,
  ) {
    // Retrieve item category or throw not found error.
    const oldItemCategory = await this.itemCategoryModel()
      .query()
      .findById(itemCategoryId)
      .throwIfNotFound();

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Unassociate items with item category.
      await this.unassociateItemsWithCategories(itemCategoryId, trx);

      // Delete item category.
      await this.itemCategoryModel()
        .query(trx)
        .findById(itemCategoryId)
        .delete();

      // Triggers `onItemCategoryDeleted` event.
      await this.eventEmitter.emitAsync(events.itemCategory.onDeleted, {
        itemCategoryId,
        oldItemCategory,
      } as IItemCategoryDeletedPayload);
    }, trx);
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

    await this.itemModel()
      .query(trx)
      .whereIn('category_id', ids)
      .patch({ categoryId: null });
  }
}
