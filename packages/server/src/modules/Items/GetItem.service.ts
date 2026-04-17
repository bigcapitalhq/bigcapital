import { EventEmitter2 } from '@nestjs/event-emitter';
import { Inject, Injectable } from '@nestjs/common';
import { Item } from './models/Item';
import { events } from '@/common/events/events';
import { TransformerInjectable } from '../Transformer/TransformerInjectable.service';
import { ItemTransformer } from './Item.transformer';
import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { ClsService } from 'nestjs-cls';
import { GetResourceCustomFieldsService } from '@/modules/CustomFields/queries/GetResourceCustomFields.service';

@Injectable()
export class GetItemService {
  constructor(
    @Inject(Item.name)
    private readonly itemModel: TenantModelProxy<typeof Item>,
    private readonly eventEmitter2: EventEmitter2,
    private readonly transformerInjectable: TransformerInjectable,
    private readonly clsService: ClsService,
    private readonly getResourceCustomFieldsService: GetResourceCustomFieldsService,
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

    // Load custom field values.
    const customFields = await this.getResourceCustomFieldsService.getResourceCustomFields(
      'Item',
      itemId,
    );

    const transformed = await this.transformerInjectable.transform(
      item,
      new ItemTransformer(),
      { customFields },
    );

    const eventPayload = { itemId };

    // Triggers the `onItemViewed` event.
    await this.eventEmitter2.emitAsync(events.item.onViewed, eventPayload);

    return transformed;
  }
}
