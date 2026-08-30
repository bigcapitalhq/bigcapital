import { EventEmitter2 } from '@nestjs/event-emitter';
import { Inject, Injectable } from '@nestjs/common';
import { Item } from './models/Item';
import { InventoryTransaction } from '@/modules/InventoryCost/models/InventoryTransaction';
import { events } from '@/common/events/events';
import { TransformerInjectable } from '../Transformer/TransformerInjectable.service';
import { ItemTransformer } from './Item.transformer';
import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { ClsService } from 'nestjs-cls';
import { raw } from 'objection';

@Injectable()
export class GetItemService {
  constructor(
    @Inject(Item.name)
    private readonly itemModel: TenantModelProxy<typeof Item>,
    @Inject(InventoryTransaction.name)
    private readonly inventoryTransactionModel: TenantModelProxy<
      typeof InventoryTransaction
    >,
    private readonly eventEmitter2: EventEmitter2,
    private readonly transformerInjectable: TransformerInjectable,
    private readonly clsService: ClsService,
  ) {}

  private async getQuantityOnHand(itemId: number): Promise<number> {
    const result = await this.inventoryTransactionModel()
      .query()
      .where('itemId', itemId)
      .select(raw("COALESCE(SUM(CASE WHEN direction = 'IN' THEN quantity WHEN direction = 'OUT' THEN -quantity ELSE 0 END), 0) as quantityOnHand"))
      .first() as any;

    return Number(result?.quantityOnHand ?? 0);
  }

  /**
   * Retrieve the item details of the given id with associated details.
   * @param {number} tenantId - The tenant id.
   * @param {number} itemId - The item id.
   */
  public async getItem(itemId: number): Promise<any> {
    const item = await this.itemModel()
      .query()
      .findById(itemId)
      .withGraphFetched('sellAccount')
      .withGraphFetched('inventoryAccount')
      .withGraphFetched('category')
      .withGraphFetched('costAccount')
      .withGraphFetched('itemWarehouses.warehouse')
      .withGraphFetched('sellTaxRate')
      .withGraphFetched('purchaseTaxRate')
      .throwIfNotFound();

    if (item.type === 'inventory') {
      (item as any).quantityOnHand = await this.getQuantityOnHand(itemId);
    }

    const transformed = await this.transformerInjectable.transform(
      item,
      new ItemTransformer(),
    );
    const eventPayload = { itemId };

    // Triggers the `onItemViewed` event.
    await this.eventEmitter2.emitAsync(events.item.onViewed, eventPayload);

    return transformed;
  }
}
