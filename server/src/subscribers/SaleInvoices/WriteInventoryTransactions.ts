import { Container } from 'typedi';
import { On, EventSubscriber } from 'event-dispatch';
import events from 'subscribers/events';
import TenancyService from 'services/Tenancy/TenancyService';
import SaleInvoicesService from 'services/Sales/SalesInvoices';

@EventSubscriber()
export default class WriteInventoryTransactions {
  logger: any;
  tenancy: TenancyService;
  saleInvoicesService: SaleInvoicesService;

  /**
   * Constructor method.
   */
  constructor() {
    this.logger = Container.get('logger');
    this.tenancy = Container.get(TenancyService);
    this.saleInvoicesService = Container.get(SaleInvoicesService);
  }

  /**
   * Handles the writing inventory transactions once the invoice created.
   */
  @On(events.saleInvoice.onCreated)
  public async handleWritingInventoryTransactions({ tenantId, saleInvoice }) {
    this.logger.info('[sale_invoice] trying to write inventory transactions.', {
      tenantId,
    });
    await this.saleInvoicesService.recordInventoryTranscactions(
      tenantId,
      saleInvoice
    );
  }

  /**
   * Rewriting the inventory transactions once the sale invoice be edited.
   */
  @On(events.saleInvoice.onEdited)
  public async handleRewritingInventoryTransactions({ tenantId, saleInvoice }) {
    this.logger.info('[sale_invoice] trying to write inventory transactions.', {
      tenantId,
    });
    await this.saleInvoicesService.recordInventoryTranscactions(
      tenantId,
      saleInvoice,
      true
    );
  }

  /**
   * Handles deleting the inventory transactions once the invoice deleted.
   */
  @On(events.saleInvoice.onDeleted)
  public async handleDeletingInventoryTransactions({
    tenantId,
    saleInvoiceId,
    oldSaleInvoice,
  }) {
    this.logger.info(
      '[sale_invoice] trying to revert inventory transactions.',
      {
        tenantId,
        saleInvoiceId,
      }
    );
    await this.saleInvoicesService.revertInventoryTransactions(
      tenantId,
      saleInvoiceId
    );
  }
}
