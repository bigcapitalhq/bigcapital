import { EventEmitter2 } from '@nestjs/event-emitter';
import { Inject, Injectable } from '@nestjs/common';
import { Item } from './models/Item';
import { events } from '@/common/events/events';
import { TransformerInjectable } from '../Transformer/TransformerInjectable.service';
import { ItemTransformer } from './Item.transformer';
import { TenantModelProxy } from '../System/models/TenantBaseModel';

@Injectable()
export class GetItemService {
  constructor(
    @Inject(Item.name) private itemModel: TenantModelProxy<typeof Item>,
    private eventEmitter2: EventEmitter2,
    private transformerInjectable: TransformerInjectable,
  ) {}

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
