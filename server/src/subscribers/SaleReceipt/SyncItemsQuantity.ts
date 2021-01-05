import { Container } from 'typedi';
import { On, EventSubscriber } from 'event-dispatch';
import events from 'subscribers/events';
import TenancyService from 'services/Tenancy/TenancyService';
import ItemsEntriesService from 'services/Items/ItemsEntriesService';
import SalesInvoicesCost from 'services/Sales/SalesInvoicesCost';

@EventSubscriber()
export default class SaleReceiptSubscriber {
  logger: any;
  tenancy: TenancyService;
  itemsEntriesService: ItemsEntriesService;

  constructor() {
    this.logger = Container.get('logger');
    this.tenancy = Container.get(TenancyService);
    this.itemsEntriesService = Container.get(ItemsEntriesService);
  }

  /**
   * Increments the sale receipt items once be created.
   */
  @On(events.saleReceipt.onCreated)
  public async handleDecremenReceiptItemsQuantity({ tenantId, saleReceipt }) {
    await this.itemsEntriesService.decrementItemsQuantity(
      tenantId,
      saleReceipt.entries
    );
  }

  /**
   * Decrements the sale receipt items once be deleted.
   */
  @On(events.saleReceipt.onDeleted)
  public async handleIncrementReceiptItemsQuantity({
    tenantId,
    oldSaleReceipt,
  }) {
    await this.itemsEntriesService.incrementItemsEntries(
      tenantId,
      oldSaleReceipt.entries
    );
  }

  /**
   * Handle increment/decrement the different items quantity once
   * the sale receipt be edited.
   */
  @On(events.saleReceipt.onEdited)
  public async handleChangeSaleInvoiceItemsQuantityOnEdit({
    tenantId,
    saleReceipt,
    oldSaleReceipt,
  }) {
    await this.itemsEntriesService.changeItemsQuantity(
      tenantId,
      saleReceipt.entries.map((entry) => ({
        ...entry,
        quantity: entry.quantity * -1,
      })),
      oldSaleReceipt.entries.map((entry) => ({
        ...entry,
        quantity: entry.quantity * -1,
      }))
    );
  }
}
