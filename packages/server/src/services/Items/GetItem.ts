import { Inject } from 'typedi';
import { IItem } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import ItemTransformer from './ItemTransformer';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';

@Inject()
export class GetItem {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Retrieve the item details of the given id with associated details.
   * @param {number} tenantId
   * @param {number} itemId
   */
  public async getItem(tenantId: number, itemId: number): Promise<IItem> {
    const { Item } = this.tenancy.models(tenantId);

    const item = await Item.query()
      .findById(itemId)
      .withGraphFetched('sellAccount')
      .withGraphFetched('inventoryAccount')
      .withGraphFetched('category')
      .withGraphFetched('costAccount')
      .withGraphFetched('itemWarehouses.warehouse')
      .withGraphFetched('sellTaxRate')
      .withGraphFetched('purchaseTaxRate')
      .throwIfNotFound();

    const transformed = await this.transformer.transform(
      tenantId,
      item,
      new ItemTransformer()
    );
    const eventPayload = { tenantId, itemId };

    // Triggers the `onItemViewed` event.
    await this.eventPublisher.emitAsync(events.item.onViewed, eventPayload);

    return transformed;
  }
}
