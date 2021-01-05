import { Container } from 'typedi';
import { On, EventSubscriber } from 'event-dispatch';
import events from 'subscribers/events';
import TenancyService from 'services/Tenancy/TenancyService';
import SalesReceiptService from 'services/Sales/SalesReceipts';

@EventSubscriber()
export default class SaleReceiptSubscriber {
  logger: any;
  tenancy: TenancyService;
  saleReceiptsService: SalesReceiptService;

  constructor() {
    this.logger = Container.get('logger');
    this.tenancy = Container.get(TenancyService);
    this.saleReceiptsService = Container.get(SalesReceiptService);
  }

  /**
   * Handles writing sale receipt income journal entries once created.
   */
  @On(events.saleReceipt.onCreated)
  public async handleWriteReceiptIncomeJournalEntrieOnCreate({
    tenantId,
    saleReceiptId,
  }) {
    const { SaleReceipt } = this.tenancy.models(tenantId);

    const saleReceiptWithItems = await SaleReceipt.query()
      .findById(saleReceiptId)
      .withGraphFetched('entries.item');

    // Writes the sale receipt income journal entries.
    await this.saleReceiptsService.writesIncomeJournalEntries(
      tenantId,
      saleReceiptWithItems
    );
  }

  /**
   * Handles sale receipt revert jouranl entries once be deleted.
   */
  @On(events.saleReceipt.onDeleted)
  public async handleRevertReceiptJournalEntriesOnDeleted({
    tenantId,
    saleReceiptId,
  }) {
    await this.saleReceiptsService.revertReceiptJournalEntries(
      tenantId,
      saleReceiptId
    );
  }

  /**
   * Handles writing sale receipt income journal entries once be edited.
   */
  @On(events.saleReceipt.onEdited)
  public async handleWriteReceiptIncomeJournalEntrieOnEdited({
    tenantId,
    saleReceiptId,
  }) {
    const { SaleReceipt } = this.tenancy.models(tenantId);

    const saleReceiptWithItems = await SaleReceipt.query()
      .findById(saleReceiptId)
      .withGraphFetched('entries.item');

    // Writes the sale receipt income journal entries.
    await this.saleReceiptsService.writesIncomeJournalEntries(
      tenantId,
      saleReceiptWithItems,
      true
    );
  }
}
