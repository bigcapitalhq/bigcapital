import { Container } from 'typedi';
import { On, EventSubscriber } from 'event-dispatch';
import events from 'subscribers/events';
import TenancyService from 'services/Tenancy/TenancyService';
import SaleInvoicesService from 'services/Sales/SalesInvoices';

@EventSubscriber()
export default class SaleInvoiceSubscriber {
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
   * Records journal entries of the non-inventory invoice.
   */
  @On(events.saleInvoice.onCreated)
  public async handleWriteJournalEntriesOnInvoiceCreated({
    tenantId,
    saleInvoiceId,
    saleInvoice,
    authorizedUser,
  }) {
    const { saleInvoiceRepository } = this.tenancy.repositories(tenantId);

    const saleInvoiceWithItems = await saleInvoiceRepository.findOneById(
      saleInvoiceId,
      'entries.item'
    );
    await this.saleInvoicesService.writesIncomeJournalEntries(
      tenantId,
      saleInvoiceWithItems
    );
  }

  /**
   * Records journal entries of the non-inventory invoice.
   */
  @On(events.saleInvoice.onEdited)
  public async handleRewriteJournalEntriesOnceInvoiceEdit({
    tenantId,
    saleInvoiceId,
    saleInvoice,
    authorizedUser,
  }) {
    await this.saleInvoicesService.writesIncomeJournalEntries(
      tenantId,
      saleInvoice,
      true
    );
  }

  /**
   * Handle reverting journal entries once sale invoice delete.
   */
  @On(events.saleInvoice.onDeleted)
  public async handleRevertingInvoiceJournalEntriesOnDelete({
    tenantId,
    saleInvoiceId,
  }) {
    await this.saleInvoicesService.revertInvoiceJournalEntries(
      tenantId,
      saleInvoiceId,
    );
  }
}
