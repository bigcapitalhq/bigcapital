import {
  IFilterMeta,
  IPaginationMeta,
  ISaleInvoice,
  ISaleInvoiceCreateDTO,
  ISaleInvoiceEditDTO,
  ISaleInvoiceSmsDetails,
  ISaleInvoiceSmsDetailsDTO,
  ISaleInvoiceWriteoffDTO,
  ISalesInvoicesFilter,
  ISystemUser,
  ITenantUser,
  InvoiceNotificationType,
} from '@/interfaces';
import { Inject, Service } from 'typedi';
import { CreateSaleInvoice } from './CreateSaleInvoice';
import { DeleteSaleInvoice } from './DeleteSaleInvoice';
import { GetSaleInvoice } from './GetSaleInvoice';
import { EditSaleInvoice } from './EditSaleInvoice';
import { GetSaleInvoices } from './GetSaleInvoices';
import { DeliverSaleInvoice } from './DeliverSaleInvoice';
import { GetSaleInvoicesPayable } from './GetSaleInvoicesPayable';
import { WriteoffSaleInvoice } from './WriteoffSaleInvoice';
import { SaleInvoicePdf } from './SaleInvoicePdf';
import { GetInvoicePaymentsService } from './GetInvoicePaymentsService';
import SaleInvoiceNotifyBySms from './SaleInvoiceNotifyBySms';

@Service()
export class SaleInvoiceApplication {
  @Inject()
  private createSaleInvoiceService: CreateSaleInvoice;

  @Inject()
  private deleteSaleInvoiceService: DeleteSaleInvoice;

  @Inject()
  private getSaleInvoiceService: GetSaleInvoice;

  @Inject()
  private getSaleInvoicesService: GetSaleInvoices;

  @Inject()
  private editSaleInvoiceService: EditSaleInvoice;

  @Inject()
  private deliverSaleInvoiceService: DeliverSaleInvoice;

  @Inject()
  private getReceivableSaleInvoicesService: GetSaleInvoicesPayable;

  @Inject()
  private writeoffInvoiceService: WriteoffSaleInvoice;

  @Inject()
  private getInvoicePaymentsService: GetInvoicePaymentsService;

  @Inject()
  private pdfSaleInvoiceService: SaleInvoicePdf;

  @Inject()
  private invoiceSms: SaleInvoiceNotifyBySms;

  /**
   * Creates a new sale invoice with associated GL entries.
   * @param {number} tenantId
   * @param {ISaleInvoiceCreateDTO} saleInvoiceDTO
   * @param {ITenantUser} authorizedUser
   * @returns {Promise<ISaleInvoice>}
   */
  public createSaleInvoice(
    tenantId: number,
    saleInvoiceDTO: ISaleInvoiceCreateDTO,
    authorizedUser: ITenantUser
  ): Promise<ISaleInvoice> {
    return this.createSaleInvoiceService.createSaleInvoice(
      tenantId,
      saleInvoiceDTO,
      authorizedUser
    );
  }

  /**
   * Edits the given sale invoice with associated GL entries.
   * @param {number} tenantId
   * @param {number} saleInvoiceId
   * @param {ISaleInvoiceEditDTO} saleInvoiceDTO
   * @param {ISystemUser} authorizedUser
   * @returns {Promise<ISaleInvoice>}
   */
  public editSaleInvoice(
    tenantId: number,
    saleInvoiceId: number,
    saleInvoiceDTO: ISaleInvoiceEditDTO,
    authorizedUser: ISystemUser
  ) {
    return this.editSaleInvoiceService.editSaleInvoice(
      tenantId,
      saleInvoiceId,
      saleInvoiceDTO,
      authorizedUser
    );
  }

  /**
   * Deletes the given sale invoice with given associated GL entries.
   * @param {number} tenantId
   * @param {number} saleInvoiceId
   * @param {ISystemUser} authorizedUser
   * @returns {Promise<void>}
   */
  public deleteSaleInvoice(
    tenantId: number,
    saleInvoiceId: number,
    authorizedUser: ISystemUser
  ): Promise<void> {
    return this.deleteSaleInvoiceService.deleteSaleInvoice(
      tenantId,
      saleInvoiceId,
      authorizedUser
    );
  }

  /**
   * Retrieves the given sale invoice details.
   * @param {number} tenantId
   * @param {ISalesInvoicesFilter} filterDTO
   * @returns
   */
  public getSaleInvoices(
    tenantId: number,
    filterDTO: ISalesInvoicesFilter
  ): Promise<{
    salesInvoices: ISaleInvoice[];
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    return this.getSaleInvoicesService.getSaleInvoices(tenantId, filterDTO);
  }

  /**
   * Retrieves sale invoice details.
   * @param {number} tenantId -
   * @param {number} saleInvoiceId -
   * @param {ISystemUser} authorizedUser -
   * @return {Promise<ISaleInvoice>}
   */
  public getSaleInvoice(
    tenantId: number,
    saleInvoiceId: number,
    authorizedUser: ISystemUser
  ) {
    return this.getSaleInvoiceService.getSaleInvoice(
      tenantId,
      saleInvoiceId,
      authorizedUser
    );
  }

  /**
   * Mark the given sale invoice as delivered.
   * @param {number} tenantId
   * @param {number} saleInvoiceId
   * @param {ISystemUser} authorizedUser
   * @returns {}
   */
  public deliverSaleInvoice(
    tenantId: number,
    saleInvoiceId: number,
    authorizedUser: ISystemUser
  ) {
    return this.deliverSaleInvoiceService.deliverSaleInvoice(
      tenantId,
      saleInvoiceId,
      authorizedUser
    );
  }

  /**
   *
   * @param {number} tenantId
   * @param {number} customerId
   * @returns
   */
  public getReceivableSaleInvoices(tenantId: number, customerId?: number) {
    return this.getReceivableSaleInvoicesService.getPayableInvoices(
      tenantId,
      customerId
    );
  }

  /**
   * Writes-off the sale invoice on bad debt expense account.
   * @param {number} tenantId
   * @param {number} saleInvoiceId
   * @param {ISaleInvoiceWriteoffDTO} writeoffDTO
   * @return {Promise<ISaleInvoice>}
   */
  public writeOff = async (
    tenantId: number,
    saleInvoiceId: number,
    writeoffDTO: ISaleInvoiceWriteoffDTO
  ): Promise<ISaleInvoice> => {
    return this.writeoffInvoiceService.writeOff(
      tenantId,
      saleInvoiceId,
      writeoffDTO
    );
  };

  /**
   * Cancels the written-off sale invoice.
   * @param {number} tenantId
   * @param {number} saleInvoiceId
   * @returns {Promise<ISaleInvoice>}
   */
  public cancelWrittenoff = (
    tenantId: number,
    saleInvoiceId: number
  ): Promise<ISaleInvoice> => {
    return this.writeoffInvoiceService.cancelWrittenoff(
      tenantId,
      saleInvoiceId
    );
  };

  /**
   * Retrieve the invoice assocaited payments transactions.
   * @param {number} tenantId - Tenant id.
   * @param {number} invoiceId - Invoice id.
   */
  public getInvoicePayments = async (tenantId: number, invoiceId: number) => {
    return this.getInvoicePaymentsService.getInvoicePayments(
      tenantId,
      invoiceId
    );
  };

  /**
   *
   * @param {number} tenantId ]
   * @param saleInvoice
   * @returns
   */
  public saleInvoicePdf(tenantId: number, saleInvoice) {
    return this.pdfSaleInvoiceService.saleInvoicePdf(tenantId, saleInvoice);
  }

  /**
   *
   * @param {number} tenantId
   * @param {number} saleInvoiceId
   * @param {InvoiceNotificationType} invoiceNotificationType
   */
  public notifySaleInvoiceBySms = async (
    tenantId: number,
    saleInvoiceId: number,
    invoiceNotificationType: InvoiceNotificationType
  ) => {
    return this.invoiceSms.notifyBySms(
      tenantId,
      saleInvoiceId,
      invoiceNotificationType
    );
  };

  /**
   * Retrieves the SMS details of the given invoice.
   * @param {number} tenantId - Tenant id.
   * @param {number} saleInvoiceId - Sale invoice id.
   */
  public getSaleInvoiceSmsDetails = async (
    tenantId: number,
    saleInvoiceId: number,
    invoiceSmsDetailsDTO: ISaleInvoiceSmsDetailsDTO
  ): Promise<ISaleInvoiceSmsDetails> => {
    return this.invoiceSms.smsDetails(
      tenantId,
      saleInvoiceId,
      invoiceSmsDetailsDTO
    );
  };
}
