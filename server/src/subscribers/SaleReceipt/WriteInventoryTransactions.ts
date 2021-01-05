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
   * Handles the writing inventory transactions once the receipt created.
   */
  @On(events.saleReceipt.onCreated)
  public async handleWritingInventoryTransactions({ tenantId, saleReceipt }) {
    this.logger.info('[sale_receipt] trying to write inventory transactions.', {
      tenantId,
    });
    await this.saleReceiptsService.recordInventoryTransactions(
      tenantId,
      saleReceipt
    );
  }

  /**
   * Rewriting the inventory transactions once the sale invoice be edited.
   */
  @On(events.saleReceipt.onEdited)
  public async handleRewritingInventoryTransactions({ tenantId, saleReceipt }) {
    this.logger.info('[sale_invoice] trying to write inventory transactions.', {
      tenantId,
    });
    await this.saleReceiptsService.recordInventoryTransactions(
      tenantId,
      saleReceipt,
      true
    );
  }

  /**
   * Handles deleting the inventory transactions once the receipt deleted.
   */
  @On(events.saleReceipt.onDeleted)
  public async handleDeletingInventoryTransactions({
    tenantId,
    saleReceiptId,
  }) {
    this.logger.info(
      '[sale_invoice] trying to revert inventory transactions.',
      {
        tenantId,
        saleReceiptId,
      }
    );
    await this.saleReceiptsService.revertInventoryTransactions(
      tenantId,
      saleReceiptId
    );
  }
}
