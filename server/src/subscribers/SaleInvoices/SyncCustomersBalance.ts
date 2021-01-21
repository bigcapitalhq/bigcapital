import { Container } from 'typedi';
import { On, EventSubscriber } from 'event-dispatch';
import events from 'subscribers/events';
import TenancyService from 'services/Tenancy/TenancyService';

@EventSubscriber()
export default class SaleInvoiceSubscriber {
  logger: any;
  tenancy: TenancyService;

  /**
   * Constructor method.
   */
  constructor() {
    this.logger = Container.get('logger');
    this.tenancy = Container.get(TenancyService);
  }

  /**
   * Handles customer balance increment once sale invoice created.
   */
  @On(events.saleInvoice.onCreated)
  public async handleCustomerBalanceIncrement({
    tenantId,
    saleInvoice,
    saleInvoiceId,
  }) {
    const { customerRepository } = this.tenancy.repositories(tenantId);

    this.logger.info('[sale_invoice] trying to increment customer balance.', {
      tenantId,
    });
    await customerRepository.changeBalance(
      saleInvoice.customerId,
      saleInvoice.balance
    );
  }

  /**
   * Handles customer balance diff balnace change once sale invoice edited.
   */
  @On(events.saleInvoice.onEdited)
  public async onSaleInvoiceEdited({
    tenantId,
    saleInvoice,
    oldSaleInvoice,
    saleInvoiceId,
  }) {
    const { customerRepository } = this.tenancy.repositories(tenantId);

    this.logger.info('[sale_invoice] trying to change diff customer balance.', {
      tenantId,
    });
    await customerRepository.changeDiffBalance(
      saleInvoice.customerId,
      saleInvoice.balance,
      oldSaleInvoice.balance,
      oldSaleInvoice.customerId
    );
  }
 
  /**
   * Handles customer balance decrement once sale invoice deleted.
   */
  @On(events.saleInvoice.onDeleted)
  public async handleCustomerBalanceDecrement({
    tenantId,
    saleInvoiceId,
    oldSaleInvoice,
  }) {
    const { customerRepository } = this.tenancy.repositories(tenantId);

    this.logger.info('[sale_invoice] trying to decrement customer balance.', {
      tenantId,
    });
    await customerRepository.changeBalance(
      oldSaleInvoice.customerId,
      oldSaleInvoice.balance * -1
    );
  }
}
