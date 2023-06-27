import { Service, Inject } from 'typedi';
import events from '@/subscribers/events';
import TenancyService from '@/services/Tenancy/TenancyService';
import SaleInvoicesService from '@/services/Sales/SalesInvoices';
import {
  ISaleInvoiceCreatedPayload,
  ISaleInvoiceDeletedPayload,
  ISaleInvoiceEditedPayload,
} from '@/interfaces';

@Service()
export default class WriteInventoryTransactions {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  saleInvoicesService: SaleInvoicesService;

  /**
   * Attaches events with handles
   */
  public attach(bus) {
    bus.subscribe(
      events.saleInvoice.onCreated,
      this.handleWritingInventoryTransactions
    );
    bus.subscribe(
      events.saleInvoice.onEdited,
      this.handleRewritingInventoryTransactions
    );
    bus.subscribe(
      events.saleInvoice.onDeleted,
      this.handleDeletingInventoryTransactions
    );
  }

  /**
   * Handles the writing inventory transactions once the invoice created.
   * @param {ISaleInvoiceCreatedPayload} payload
   */
  private handleWritingInventoryTransactions = async ({
    tenantId,
    saleInvoice,
    trx,
  }: ISaleInvoiceCreatedPayload) => {
    await this.saleInvoicesService.recordInventoryTransactions(
      tenantId,
      saleInvoice,
      false,
      trx
    );
  };

  /**
   * Rewriting the inventory transactions once the sale invoice be edited.
   * @param {ISaleInvoiceEditPayload} payload - 
   */
  private handleRewritingInventoryTransactions = async ({
    tenantId,
    saleInvoice,
    trx,
  }: ISaleInvoiceEditedPayload) => {
    await this.saleInvoicesService.recordInventoryTransactions(
      tenantId,
      saleInvoice,
      true,
      trx
    );
  };

  /**
   * Handles deleting the inventory transactions once the invoice deleted.
   * @param {ISaleInvoiceDeletedPayload} payload - 
   */
  private handleDeletingInventoryTransactions = async ({
    tenantId,
    saleInvoiceId,
    oldSaleInvoice,
    trx,
  }: ISaleInvoiceDeletedPayload) => {
    await this.saleInvoicesService.revertInventoryTransactions(
      tenantId,
      saleInvoiceId,
      trx
    );
  };
}
