import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import events from 'subscribers/events';
import TenancyService from 'services/Tenancy/TenancyService';
import ItemsEntriesService from 'services/Items/ItemsEntriesService';

@EventSubscriber()
export default class BillSubscriber {
  tenancy: TenancyService;
  logger: any;
  itemsEntriesService: ItemsEntriesService;

  /**
   * Constructor method.
   */
  constructor() {
    this.tenancy = Container.get(TenancyService);
    this.logger = Container.get('logger');
    this.itemsEntriesService = Container.get(ItemsEntriesService);
  }

  /**
   * Increments the sale invoice items once the invoice created.
   */
  @On(events.bill.onCreated)
  public async handleDecrementSaleInvoiceItemsQuantity({ tenantId, bill }) {
    await this.itemsEntriesService.incrementItemsEntries(
      tenantId,
      bill.entries
    );
  }

  /**
   * Decrements the sale invoice items once the invoice deleted.
   */
  @On(events.bill.onDeleted)
  public async handleIncrementSaleInvoiceItemsQuantity({ tenantId, oldBill }) {
    await this.itemsEntriesService.decrementItemsQuantity(
      tenantId,
      oldBill.entries
    );
  }

  /**
   * Handle increment/decrement the different items quantity once the sale invoice be edited.
   */
  @On(events.bill.onEdited)
  public async handleChangeSaleInvoiceItemsQuantityOnEdit({
    tenantId,
    bill,
    oldBill,
  }) {
    await this.itemsEntriesService.changeItemsQuantity(
      tenantId,
      bill.entries,
      oldBill.entries
    );
  }
}
