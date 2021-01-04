import { Container } from 'typedi';
import { head, map } from 'lodash';
import { On, EventSubscriber } from 'event-dispatch';
import events from 'subscribers/events';
import TenancyService from 'services/Tenancy/TenancyService';
import SettingsService from 'services/Settings/SettingsService';
import SaleEstimateService from 'services/Sales/SalesEstimate';
import SaleInvoicesService from 'services/Sales/SalesInvoices';
import ItemsEntriesService from 'services/Items/ItemsEntriesService';
import SalesInvoicesCost from 'services/Sales/SalesInvoicesCost';

@EventSubscriber()
export default class SaleInvoiceSubscriber {
  logger: any;
  tenancy: TenancyService;
  settingsService: SettingsService;
  saleEstimatesService: SaleEstimateService;
  saleInvoicesService: SaleInvoicesService;
  itemsEntriesService: ItemsEntriesService;
  salesInvoicesCost: SalesInvoicesCost;

  constructor() {
    this.logger = Container.get('logger');
    this.tenancy = Container.get(TenancyService);
    this.settingsService = Container.get(SettingsService);
    this.saleEstimatesService = Container.get(SaleEstimateService);
    this.saleInvoicesService = Container.get(SaleInvoicesService);
    this.itemsEntriesService = Container.get(ItemsEntriesService);
    this.salesInvoicesCost = Container.get(SalesInvoicesCost);
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
   * Marks the sale estimate as converted from the sale invoice once created.
   */
  @On(events.saleInvoice.onCreated)
  public async handleMarkEstimateConvert({
    tenantId,
    saleInvoice,
    saleInvoiceId,
  }) {
    if (saleInvoice.fromEstimateId) {
      this.saleEstimatesService.convertEstimateToInvoice(
        tenantId,
        saleInvoice.fromEstiamteId,
        saleInvoiceId
      );
    }
  }

  /**
   * Handles sale invoice next number increment once invoice created.
   */
  @On(events.saleInvoice.onCreated)
  public async handleInvoiceNextNumberIncrement({
    tenantId,
    saleInvoiceId,
    saleInvoice,
  }) {
    await this.settingsService.incrementNextNumber(tenantId, {
      key: 'next_number',
      group: 'sales_invoices',
    });
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
      saleInvoice.id,
      saleInvoice.invoiceDate
    );
  }

  /**
   * Handles handle write income journal entries of sale invoice.
   */
  @On(events.saleInvoice.onCreated)
  public async handleWriteInvoiceIncomeJournalEntries({
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
   * Rewriting the inventory transactions once the sale invoice be edited.
   */
  @On(events.saleInvoice.onEdited)
  public async handleRewritingInventoryTransactions({ tenantId, saleInvoice }) {
    this.logger.info('[sale_invoice] trying to write inventory transactions.', {
      tenantId,
    });
    await this.saleInvoicesService.recordInventoryTranscactions(
      tenantId,
      saleInvoice.id,
      saleInvoice.invoiceDate,
      true
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
   * Records journal entries of the non-inventory invoice.
   */
  @On(events.saleInvoice.onEdited)
  public async handleRewriteJournalEntriesOnceInvoiceEdit({
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
      saleInvoiceWithItems,
      true
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

  /**
   * Handle reverting journal entries once sale invoice delete.
   */
  @On(events.saleInvoice.onDelete)
  public async handleRevertingInvoiceJournalEntriesOnDelete({
    tenantId,
    saleInvoiceId,
  }) {
    await this.saleInvoicesService.revertInvoiceJournalEntries(
      tenantId,
      saleInvoiceId,
    );
  }

  /**
   * Handles deleting the inventory transactions once the invoice deleted.
   */
  @On(events.saleInvoice.onDelete)
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

  /**
   * Schedules compute invoice items cost job.
   */
  @On(events.saleInvoice.onInventoryTransactionsCreated)
  public async handleComputeCostsOnInventoryTransactionsCreated({
    tenantId,
    saleInvoiceId,
  }) {
    this.logger.info(
      '[sale_invoice] trying to compute the invoice items cost.',
      {
        tenantId,
        saleInvoiceId,
      }
    );
    await this.salesInvoicesCost.scheduleComputeCostByInvoiceId(
      tenantId,
      saleInvoiceId
    );
  }

  /**
   * Schedules compute items cost once the inventory transactions deleted.
   */
  @On(events.saleInvoice.onInventoryTransactionsDeleted)
  public async handleComputeCostsOnInventoryTransactionsDeleted({
    tenantId,
    saleInvoiceId,
    oldInventoryTransactions,
  }) {
    const inventoryItemsIds = map(oldInventoryTransactions, 'itemId');
    const startingDates = map(oldInventoryTransactions, 'date');
    const startingDate = head(startingDates);

    await this.salesInvoicesCost.scheduleComputeCostByItemsIds(
      tenantId,
      inventoryItemsIds,
      startingDate
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
