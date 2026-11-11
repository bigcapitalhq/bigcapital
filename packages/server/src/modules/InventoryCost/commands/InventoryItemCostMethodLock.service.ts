import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { uniq } from 'lodash';
import type { TCostMethod } from '@/common/constants/inventory.constants';
import { Item } from '@/modules/Items/models/Item';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { ItemCostMethodResolverService } from './ItemCostMethodResolver.service';

@Injectable()
export class InventoryItemCostMethodLockService {
  /**
   * @param {TenantModelProxy<typeof Item>} itemModel - Item model.
   * @param {ItemCostMethodResolverService} costMethodResolver - Cost method resolver.
   */
  constructor(
    @Inject(Item.name)
    private readonly itemModel: TenantModelProxy<typeof Item>,

    private readonly costMethodResolver: ItemCostMethodResolverService,
  ) {}

  /**
   * Freezes the cost method of the given items on their first inventory
   * transaction. Items that are already locked are left untouched, so deleting
   * all inventory transactions never unlocks an item.
   * @param {number[]} itemIds - The inventory items ids.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @returns {Promise<void>}
   */
  public async lockItemsCostMethod(
    itemIds: number[],
    trx: Knex.Transaction,
  ): Promise<void> {
    const uniqueItemIds = uniq(
      itemIds.filter((itemId): itemId is number => !!itemId),
    );
    if (!uniqueItemIds.length) {
      return;
    }
    const items = await this.itemModel()
      .query(trx)
      .whereIn('id', uniqueItemIds)
      .where('type', 'inventory')
      .whereNull('costMethodLockedAt')
      .withGraphFetched('category')
      .forUpdate();

    if (!items.length) {
      return;
    }
    const defaultMethod = await this.costMethodResolver.getDefaultCostMethod();
    const itemsByCostMethod = new Map<TCostMethod, number[]>();

    for (const item of items) {
      const costMethod = this.costMethodResolver.resolveCostMethod(
        item,
        defaultMethod,
      );
      const itemIds = itemsByCostMethod.get(costMethod) ?? [];
      itemIds.push(item.id);
      itemsByCostMethod.set(costMethod, itemIds);
    }
    const lockedAt = new Date();

    for (const [costMethod, itemIds] of itemsByCostMethod) {
      await this.itemModel()
        .query(trx)
        .whereIn('id', itemIds)
        .whereNull('costMethodLockedAt')
        .patch({
          costMethod,
          costMethodLockedAt: lockedAt,
        });
    }
  }
}
