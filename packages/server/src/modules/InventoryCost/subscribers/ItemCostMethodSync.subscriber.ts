import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Knex } from 'knex';
import { keyBy, uniq } from 'lodash';
import { events } from '@/common/events/events';
import {
  normalizeCostMethod,
  TCostMethod,
} from '@/common/constants/inventory.constants';
import { IItemEventEditedPayload } from '@/interfaces/Item';
import { Item } from '@/modules/Items/models/Item';
import { ItemCategory } from '@/modules/ItemCategories/models/ItemCategory.model';
import { IItemCategoryEditedPayload } from '@/modules/ItemCategories/ItemCategory.interfaces';
import { runAfterTransaction } from '@/modules/Tenancy/TenancyDB/TransactionsHooks';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { InventoryComputeCostService } from '../commands/InventoryComputeCost.service';
import { InventoryTransaction } from '../models/InventoryTransaction';

@Injectable()
export class ItemCostMethodSyncSubscriber {
  constructor(
    private readonly inventoryComputeCostService: InventoryComputeCostService,

    @Inject(Item.name)
    private readonly itemModel: TenantModelProxy<typeof Item>,

    @Inject(ItemCategory.name)
    private readonly itemCategoryModel: TenantModelProxy<typeof ItemCategory>,

    @Inject(InventoryTransaction.name)
    private readonly inventoryTransactionModel: TenantModelProxy<
      typeof InventoryTransaction
    >,
  ) {}

  /**
   * Re-computes the inventory items cost once the item category cost method
   * has been changed.
   * @param {IItemCategoryEditedPayload} payload - The event payload.
   */
  @OnEvent(events.itemCategory.onEdited)
  public async onItemCategoryEdited({
    oldItemCategory,
    itemCategory,
    trx,
  }: IItemCategoryEditedPayload) {
    const oldCostMethod = normalizeCostMethod(oldItemCategory?.costMethod);
    const newCostMethod = normalizeCostMethod(itemCategory?.costMethod);

    if (oldCostMethod === newCostMethod) {
      return;
    }
    const items = await this.itemModel()
      .query(trx)
      .where('categoryId', itemCategory.id)
      .where('type', 'inventory');

    await this.scheduleItemsRebuild(
      items.map((item) => item.id),
      trx,
    );
  }

  /**
   * Re-computes the inventory item cost once the item category has been
   * changed to a category with a different cost method.
   * @param {IItemEventEditedPayload} payload - The event payload.
   */
  @OnEvent(events.item.onEdited)
  public async onItemEdited({ oldItem, item, trx }: IItemEventEditedPayload) {
    if (
      oldItem.type !== 'inventory' ||
      item.type !== 'inventory' ||
      oldItem.categoryId === item.categoryId
    ) {
      return;
    }
    const categoriesIds = uniq(
      [oldItem.categoryId, item.categoryId].filter(
        (categoryId): categoryId is number => !!categoryId,
      ),
    );
    const categories = await this.itemCategoryModel()
      .query(trx)
      .whereIn('id', categoriesIds);
    const categoriesMap = keyBy(categories, 'id');

    const oldCostMethod = this.getCategoryCostMethod(
      categoriesMap,
      oldItem.categoryId,
    );
    const newCostMethod = this.getCategoryCostMethod(
      categoriesMap,
      item.categoryId,
    );

    if (oldCostMethod === newCostMethod) {
      return;
    }
    await this.scheduleItemsRebuild([item.id], trx);
  }

  /**
   * Retrieves the cost method of the given category.
   * @param {Record<number, ItemCategory>} categoriesMap - The categories map.
   * @param {number} categoryId - The category id.
   * @returns {TCostMethod}
   */
  private getCategoryCostMethod(
    categoriesMap: Record<number, ItemCategory>,
    categoryId?: number,
  ): TCostMethod {
    if (!categoryId) {
      return normalizeCostMethod(null);
    }
    return normalizeCostMethod(categoriesMap[categoryId]?.costMethod);
  }

  /**
   * Schedules re-computing the cost of the given items from their earliest
   * inventory transaction date.
   * @param {number[]} itemIds - The inventory items ids.
   * @param {Knex.Transaction} trx - The knex transaction.
   * @returns {Promise<void>}
   */
  private async scheduleItemsRebuild(
    itemIds: number[],
    trx: Knex.Transaction,
  ): Promise<void> {
    const uniqueItemIds = uniq(
      itemIds.filter((itemId): itemId is number => !!itemId),
    );

    if (!uniqueItemIds.length) {
      return;
    }
    const itemEarliestTransactions = await this.inventoryTransactionModel()
      .query(trx)
      .select('itemId')
      .min('date as date')
      .whereIn('itemId', uniqueItemIds)
      .groupBy('itemId');

    const schedulableTransactions = itemEarliestTransactions.filter(
      (transaction) => !!transaction.date && !!transaction.itemId,
    );
    if (!schedulableTransactions.length) {
      return;
    }
    runAfterTransaction(trx, async () => {
      try {
        await this.inventoryComputeCostService.markItemsCostComputeRunning(
          true,
        );

        for (const transaction of schedulableTransactions) {
          await this.inventoryComputeCostService.scheduleComputeItemCost(
            transaction.itemId,
            transaction.date,
          );
        }
      } catch (error) {
        await this.inventoryComputeCostService.markItemsCostComputeRunning(
          false,
        );
        console.error(
          '[error] Failed to schedule item cost re-compute after cost method change:',
          error,
        );
      }
    });
  }
}
