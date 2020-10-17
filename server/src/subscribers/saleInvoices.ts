import { Container } from 'typedi';
import { On, EventSubscriber } from "event-dispatch";
import events from 'subscribers/events';

@EventSubscriber()
export default class SaleInvoiceSubscriber {

  @On(events.saleInvoice.onCreated)
  public onSaleInvoiceCreated(payload) {

  }

  @On(events.saleInvoice.onEdited)
  public onSaleInvoiceEdited(payload) {

  }

  @On(events.saleInvoice.onDeleted)
  public onSaleInvoiceDeleted(payload) {

  }
}