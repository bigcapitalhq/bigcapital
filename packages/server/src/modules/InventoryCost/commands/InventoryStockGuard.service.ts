import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { Features } from '@/common/types/Features';
import { Item } from '@/modules/Items/models/Item';
import { ServiceError } from '@/modules/Items/ServiceError';
import { SettingsStore } from '@/modules/Settings/SettingsStore';
import { SETTINGS_PROVIDER } from '@/modules/Settings/Settings.types';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { ItemWarehouseQuantity } from '@/modules/Warehouses/models/ItemWarehouseQuantity';
import {
  ERRORS,
  PREVENT_STOCK_FROM_GOING_BELOW_ZERO_SETTING,
} from '../InventoryCost.constants';
import { InventoryTransaction } from '../models/InventoryTransaction';
import {
  IInventoryStockShortage,
  IInventoryTransactionRecord,
} from '../types/InventoryCost.types';

type TransactionLike = Pick<
  IInventoryTransactionRecord,
  'direction' | 'itemId' | 'quantity' | 'warehouseId'
>;

interface IItemStockEffect {
  total: number;
  warehouses: Map<number, number>;
}

interface IWarehouseStockEffect {
  itemId: number;
  warehouseId: number;
  quantity: number;
}

@Injectable()
export class InventoryStockGuard {
  /**
   * @param {TenantModelProxy<typeof Item>} itemModel - Item model.
   * @param {TenantModelProxy<typeof ItemWarehouseQuantity>} itemWarehouseQuantityModel - Item warehouse quantity model.
   * @param {TenantModelProxy<typeof InventoryTransaction>} inventoryTransactionModel - Inventory transaction model.
   * @param {() => SettingsStore} settingsStore - Settings store.
   */
  constructor(
    @Inject(Item.name)
    private readonly itemModel: TenantModelProxy<typeof Item>,

    @Inject(ItemWarehouseQuantity.name)
    private readonly itemWarehouseQuantityModel: TenantModelProxy<
      typeof ItemWarehouseQuantity
    >,

    @Inject(InventoryTransaction.name)
    private readonly inventoryTransactionModel: TenantModelProxy<
      typeof InventoryTransaction
    >,

    @Inject(SETTINGS_PROVIDER)
    private readonly settingsStore: () => SettingsStore,
  ) {}

  /**
   * Validates that the given inventory transactions will not make stock negative.
   * @param {IInventoryTransactionRecord[]} transactions - Inventory transactions.
   * @param {boolean} override - Whether the existing transactions will be replaced.
   * @param {Knex.Transaction} trx - Knex transaction.
   */
  public async assertSufficientStock(
    transactions: IInventoryTransactionRecord[],
    override: boolean = false,
    trx?: Knex.Transaction,
  ): Promise<void> {
    const settings = await this.settingsStore();

    if (!this.isPreventStockBelowZeroEnabled(settings)) {
      return;
    }
    const newEffects = this.getStockEffects(transactions);

    if (!newEffects.size) {
      return;
    }
    const oldTransactions = override
      ? await this.findOldInventoryTransactions(transactions, trx)
      : [];
    const oldEffects = this.getStockEffects(oldTransactions);
    const netEffects = this.getNetStockEffects(newEffects, oldEffects);

    await this.assertEffects(netEffects, settings, trx);
  }

  /**
   * Validates that reverting the given inventory transactions will not make
   * stock negative.
   * @param {InventoryTransaction[]} transactions - Inventory transactions.
   * @param {Knex.Transaction} trx - Knex transaction.
   */
  public async assertSufficientStockForDeletion(
    transactions: InventoryTransaction[],
    trx?: Knex.Transaction,
  ): Promise<void> {
    const settings = await this.settingsStore();

    if (!this.isPreventStockBelowZeroEnabled(settings)) {
      return;
    }
    const effects = this.getStockEffects(transactions);

    if (!effects.size) {
      return;
    }
    const reversedEffects = this.reverseStockEffects(effects);

    await this.assertEffects(reversedEffects, settings, trx);
  }

  /**
   * Retrieves whether preventing stock from going below zero is enabled.
   * @param {SettingsStore} settings - Settings store.
   * @returns {boolean}
   */
  private isPreventStockBelowZeroEnabled(settings: SettingsStore): boolean {
    return Boolean(
      settings.get(
        {
          group: 'items',
          key: PREVENT_STOCK_FROM_GOING_BELOW_ZERO_SETTING,
        },
        false,
      ),
    );
  }

  /**
   * Retrieves whether multi-warehouses is enabled.
   * @param {SettingsStore} settings - Settings store.
   * @returns {boolean}
   */
  private isWarehousesFeatureEnabled(settings: SettingsStore): boolean {
    return Boolean(
      settings.get({ group: 'features', key: Features.WAREHOUSES }, false),
    );
  }

  /**
   * Aggregates the signed stock effects of the given inventory transactions.
   * @param {TransactionLike[]} transactions - Inventory transactions.
   * @returns {Map<number, IItemStockEffect>}
   */
  private getStockEffects(
    transactions: TransactionLike[],
  ): Map<number, IItemStockEffect> {
    const effects = new Map<number, IItemStockEffect>();

    for (const transaction of transactions) {
      if (transaction.itemId === undefined || transaction.itemId === null) {
        continue;
      }
      if (transaction.quantity === undefined || transaction.quantity === null) {
        continue;
      }
      if (transaction.direction !== 'IN' && transaction.direction !== 'OUT') {
        continue;
      }
      const quantity = Number(transaction.quantity);

      if (!Number.isFinite(quantity) || quantity === 0) {
        continue;
      }
      const itemId = Number(transaction.itemId);
      const signedQuantity =
        transaction.direction === 'IN' ? quantity : -quantity;
      const effect = effects.get(itemId) ?? {
        total: 0,
        warehouses: new Map<number, number>(),
      };

      effect.total += signedQuantity;

      if (
        transaction.warehouseId !== undefined &&
        transaction.warehouseId !== null
      ) {
        const warehouseId = Number(transaction.warehouseId);
        const warehouseQuantity = effect.warehouses.get(warehouseId) ?? 0;

        effect.warehouses.set(warehouseId, warehouseQuantity + signedQuantity);
      }
      effects.set(itemId, effect);
    }
    return effects;
  }

  /**
   * Computes the net effects after replacing the old transactions with the new ones.
   * @param {Map<number, IItemStockEffect>} newEffects - New stock effects.
   * @param {Map<number, IItemStockEffect>} oldEffects - Old stock effects.
   * @returns {Map<number, IItemStockEffect>}
   */
  private getNetStockEffects(
    newEffects: Map<number, IItemStockEffect>,
    oldEffects: Map<number, IItemStockEffect>,
  ): Map<number, IItemStockEffect> {
    const netEffects = new Map<number, IItemStockEffect>();
    const itemIds = new Set([...newEffects.keys(), ...oldEffects.keys()]);

    for (const itemId of itemIds) {
      const newEffect = newEffects.get(itemId);
      const oldEffect = oldEffects.get(itemId);
      const total = (newEffect?.total ?? 0) - (oldEffect?.total ?? 0);
      const warehouses = new Map<number, number>();
      const warehouseIds = new Set([
        ...(newEffect?.warehouses.keys() ?? []),
        ...(oldEffect?.warehouses.keys() ?? []),
      ]);

      for (const warehouseId of warehouseIds) {
        const quantity =
          (newEffect?.warehouses.get(warehouseId) ?? 0) -
          (oldEffect?.warehouses.get(warehouseId) ?? 0);

        if (quantity !== 0) {
          warehouses.set(warehouseId, quantity);
        }
      }
      if (total !== 0 || warehouses.size) {
        netEffects.set(itemId, { total, warehouses });
      }
    }
    return netEffects;
  }

  /**
   * Reverses the given stock effects.
   * @param {Map<number, IItemStockEffect>} effects - Stock effects.
   * @returns {Map<number, IItemStockEffect>}
   */
  private reverseStockEffects(
    effects: Map<number, IItemStockEffect>,
  ): Map<number, IItemStockEffect> {
    const reversedEffects = new Map<number, IItemStockEffect>();

    for (const [itemId, effect] of effects) {
      const warehouses = new Map<number, number>();

      for (const [warehouseId, quantity] of effect.warehouses) {
        warehouses.set(warehouseId, -quantity);
      }
      reversedEffects.set(itemId, { total: -effect.total, warehouses });
    }
    return reversedEffects;
  }

  /**
   * Retrieves the stored inventory transactions that will be replaced.
   * @param {IInventoryTransactionRecord[]} transactions - New inventory transactions.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @returns {Promise<InventoryTransaction[]>}
   */
  private async findOldInventoryTransactions(
    transactions: IInventoryTransactionRecord[],
    trx?: Knex.Transaction,
  ): Promise<InventoryTransaction[]> {
    const references = new Map<
      string,
      { transactionType: string; transactionId: number }
    >();
    const oldTransactions: InventoryTransaction[] = [];

    for (const transaction of transactions) {
      if (!transaction.transactionType || !transaction.transactionId) {
        continue;
      }
      references.set(
        `${transaction.transactionType}:${transaction.transactionId}`,
        {
          transactionType: transaction.transactionType,
          transactionId: transaction.transactionId,
        },
      );
    }
    for (const reference of references.values()) {
      let query = this.inventoryTransactionModel()
        .query(trx)
        .where('transactionType', reference.transactionType)
        .where('transactionId', reference.transactionId);

      if (trx) {
        query = query.forUpdate();
      }
      oldTransactions.push(...(await query));
    }
    return oldTransactions;
  }

  /**
   * Asserts that applying the given stock effects will not make stock negative.
   * @param {Map<number, IItemStockEffect>} effects - Stock effects.
   * @param {SettingsStore} settings - Settings store.
   * @param {Knex.Transaction} trx - Knex transaction.
   */
  private async assertEffects(
    effects: Map<number, IItemStockEffect>,
    settings: SettingsStore,
    trx?: Knex.Transaction,
  ): Promise<void> {
    const negativeEffects = new Map<number, IItemStockEffect>();
    const itemIds: number[] = [];

    for (const [itemId, effect] of effects) {
      const hasNegativeWarehouseEffect = [...effect.warehouses.values()].some(
        (quantity) => quantity < 0,
      );

      if (effect.total < 0 || hasNegativeWarehouseEffect) {
        negativeEffects.set(itemId, effect);
        itemIds.push(itemId);
      }
    }
    if (!itemIds.length) {
      return;
    }
    let itemsQuery = this.itemModel()
      .query(trx)
      .whereIn('id', itemIds)
      .where('type', 'inventory');

    if (trx) {
      itemsQuery = itemsQuery.forUpdate();
    }
    const items = await itemsQuery;
    const itemsMap = new Map(items.map((item) => [item.id, item]));
    const failures: IInventoryStockShortage[] = [];
    const failedItemIds = new Set<number>();

    for (const [itemId, effect] of negativeEffects) {
      const item = itemsMap.get(itemId);

      if (!item) {
        continue;
      }
      const availableQuantity = this.toNumber(item.quantityOnHand);
      const projectedQuantity = this.roundQuantity(
        availableQuantity + effect.total,
      );

      if (effect.total < 0 && projectedQuantity < 0) {
        failures.push({
          itemId,
          itemName: item.name,
          availableQuantity: this.roundQuantity(availableQuantity),
          requestedQuantity: this.roundQuantity(-effect.total),
        });
        failedItemIds.add(itemId);
      }
    }

    if (this.isWarehousesFeatureEnabled(settings)) {
      const warehouseEffects = new Map<string, IWarehouseStockEffect>();

      for (const [itemId, effect] of negativeEffects) {
        if (failedItemIds.has(itemId)) {
          continue;
        }
        for (const [warehouseId, quantity] of effect.warehouses) {
          if (quantity < 0) {
            warehouseEffects.set(`${itemId}:${warehouseId}`, {
              itemId,
              warehouseId,
              quantity,
            });
          }
        }
      }
      if (warehouseEffects.size) {
        const warehouseItemIds = [
          ...new Set([...warehouseEffects.values()].map((e) => e.itemId)),
        ];
        const warehouseIds = [
          ...new Set([...warehouseEffects.values()].map((e) => e.warehouseId)),
        ];
        let warehouseQuery = this.itemWarehouseQuantityModel()
          .query(trx)
          .whereIn('itemId', warehouseItemIds)
          .whereIn('warehouseId', warehouseIds);

        if (trx) {
          warehouseQuery = warehouseQuery.forUpdate();
        }
        const warehouseQuantities = await warehouseQuery;
        const warehouseQuantitiesMap = new Map(
          warehouseQuantities.map((warehouseQuantity) => [
            `${warehouseQuantity.itemId}:${warehouseQuantity.warehouseId}`,
            this.toNumber(warehouseQuantity.quantityOnHand),
          ]),
        );

        for (const effect of warehouseEffects.values()) {
          const item = itemsMap.get(effect.itemId);
          const availableQuantity =
            warehouseQuantitiesMap.get(
              `${effect.itemId}:${effect.warehouseId}`,
            ) ?? 0;
          const projectedQuantity = this.roundQuantity(
            availableQuantity + effect.quantity,
          );

          if (!item || projectedQuantity >= 0) {
            continue;
          }
          failures.push({
            itemId: effect.itemId,
            itemName: item.name,
            availableQuantity: this.roundQuantity(availableQuantity),
            requestedQuantity: this.roundQuantity(-effect.quantity),
            warehouseId: effect.warehouseId,
          });
        }
      }
    }

    if (failures.length) {
      throw new ServiceError(
        ERRORS.INVENTORY_ITEM_INSUFFICIENT_STOCK,
        'The transaction would result in negative inventory stock.',
        { items: failures },
      );
    }
  }

  /**
   * Converts the given value to a number.
   * @param {unknown} value - Value to convert.
   * @returns {number}
   */
  private toNumber(value: unknown): number {
    const number = Number(value);

    return Number.isFinite(number) ? number : 0;
  }

  /**
   * Rounds the given quantity to three decimal places.
   * @param {number} value - Quantity value.
   * @returns {number}
   */
  private roundQuantity(value: number): number {
    return Math.round(value * 1000) / 1000 || 0;
  }
}
