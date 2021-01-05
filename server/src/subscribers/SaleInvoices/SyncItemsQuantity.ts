import { Container } from 'typedi';
import { On, EventSubscriber } from 'event-dispatch';
import events from 'subscribers/events';
import TenancyService from 'services/Tenancy/TenancyService';
import ItemsEntriesService from 'services/Items/ItemsEntriesService';

@EventSubscriber()
export default class SyncItemsQuantityWithInvoices {
  logger: any;
  tenancy: TenancyService;
  itemsEntriesService: ItemsEntriesService;

  /**
   * Constructor method.
   */
  constructor() {
    this.logger = Container.get('logger');
    this.tenancy = Container.get(TenancyService);
    this.itemsEntriesService = Container.get(ItemsEntriesService);
  }

  /**
   * Increments the sale invoice items once the invoice created.
   */
  @On(events.saleInvoice.onCreated)
  public async handleDecrementSaleInvoiceItemsQuantity({
    tenantId,
    saleInvoice,
  }) {
    await this.itemsEntriesService.decrementItemsQuantity(
      tenantId,
      saleInvoice.entries
    );
  }

  /**
   * Decrements the sale invoice items once the invoice deleted.
   */
  @On(events.saleInvoice.onDeleted)
  public async handleIncrementSaleInvoiceItemsQuantity({
    tenantId,
    oldSaleInvoice,
  }) {
    await this.itemsEntriesService.incrementItemsEntries(
      tenantId,
      oldSaleInvoice.entries
    );
  }

  /**
   * Handle increment/decrement the different items quantity once the sale invoice be edited.
   */
  @On(events.saleInvoice.onEdited)
  public async handleChangeSaleInvoiceItemsQuantityOnEdit({
    tenantId,
    saleInvoice,
    oldSaleInvoice,
  }) {
    await this.itemsEntriesService.changeItemsQuantity(
      tenantId,
      saleInvoice.entries.map((entry) => ({
        ...entry,
        quantity: entry.quantity * -1,
      })),
      oldSaleInvoice.entries.map((entry) => ({
        ...entry,
        quantity: entry.quantity * -1,
      }))
    );
  }
}
