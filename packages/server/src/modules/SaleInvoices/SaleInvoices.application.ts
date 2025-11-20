import { Injectable } from '@nestjs/common';
import { CreateSaleInvoice } from './commands/CreateSaleInvoice.service';
import { DeleteSaleInvoice } from './commands/DeleteSaleInvoice.service';
import { GetSaleInvoice } from './queries/GetSaleInvoice.service';
import { EditSaleInvoice } from './commands/EditSaleInvoice.service';
import { DeliverSaleInvoice } from './commands/DeliverSaleInvoice.service';
import { GetSaleInvoicesPayable } from './queries/GetSaleInvoicesPayable.service';
import { WriteoffSaleInvoice } from './commands/WriteoffSaleInvoice.service';
import { SaleInvoicePdf } from './queries/SaleInvoicePdf.service';
import { GetInvoicePaymentsService } from './queries/GetInvoicePayments.service';
import { GetSaleInvoiceState } from './queries/GetSaleInvoiceState.service';
import { GetSaleInvoiceMailState } from './queries/GetSaleInvoiceMailState.service';
import {
  ISaleInvoiceWriteoffDTO,
  ISalesInvoicesFilter,
  SaleInvoiceMailState,
  SendInvoiceMailDTO,
} from './SaleInvoice.types';
import { GetSaleInvoicesService } from './queries/GetSaleInvoices';
import { SendSaleInvoiceMail } from './commands/SendSaleInvoiceMail';
import {
  CreateSaleInvoiceDto,
  EditSaleInvoiceDto,
} from './dtos/SaleInvoice.dto';
import { GenerateShareLink } from './commands/GenerateInvoicePaymentLink.service';
import { BulkDeleteSaleInvoicesService } from './BulkDeleteSaleInvoices.service';
import { ValidateBulkDeleteSaleInvoicesService } from './ValidateBulkDeleteSaleInvoices.service';

@Injectable()
export class SaleInvoiceApplication {
  constructor(
    private createSaleInvoiceService: CreateSaleInvoice,
    private deleteSaleInvoiceService: DeleteSaleInvoice,
    private getSaleInvoiceService: GetSaleInvoice,
    private getSaleInvoicesService: GetSaleInvoicesService,
    private editSaleInvoiceService: EditSaleInvoice,
    private deliverSaleInvoiceService: DeliverSaleInvoice,
    private getReceivableSaleInvoicesService: GetSaleInvoicesPayable,
    private writeoffInvoiceService: WriteoffSaleInvoice,
    private getInvoicePaymentsService: GetInvoicePaymentsService,
    private pdfSaleInvoiceService: SaleInvoicePdf,
    private getSaleInvoiceStateService: GetSaleInvoiceState,
    private sendSaleInvoiceMailService: SendSaleInvoiceMail,
    private getSaleInvoiceMailStateService: GetSaleInvoiceMailState,
    private generateShareLinkService: GenerateShareLink,
    private bulkDeleteSaleInvoicesService: BulkDeleteSaleInvoicesService,
    private validateBulkDeleteSaleInvoicesService: ValidateBulkDeleteSaleInvoicesService,
  ) { }

  /**
   * Creates a new sale invoice with associated GL entries.
   * @param {ISaleInvoiceCreateDTO} saleInvoiceDTO
   * @returns {Promise<ISaleInvoice>}
   */
  public createSaleInvoice(saleInvoiceDTO: CreateSaleInvoiceDto) {
    return this.createSaleInvoiceService.createSaleInvoice(saleInvoiceDTO);
  }

  /**
   * Edits the given sale invoice with associated GL entries.
   * @param {ISaleInvoiceEditDTO} saleInvoiceDTO
   * @returns {Promise<ISaleInvoice>}
   */
  public editSaleInvoice(
    saleInvoiceId: number,
    saleInvoiceDTO: EditSaleInvoiceDto,
  ) {
    return this.editSaleInvoiceService.editSaleInvoice(
      saleInvoiceId,
      saleInvoiceDTO,
    );
  }

  /**
   * Deletes the given sale invoice with given associated GL entries.
   * @param {number} tenantId
   * @param {number} saleInvoiceId
   * @param {ISystemUser} authorizedUser
   * @returns {Promise<void>}
   */
  public deleteSaleInvoice(saleInvoiceId: number) {
    return this.deleteSaleInvoiceService.deleteSaleInvoice(saleInvoiceId);
  }

  /**
   * Deletes multiple sale invoices.
   * @param {number[]} saleInvoiceIds
   * @return {Promise<void>}
   */
  public bulkDeleteSaleInvoices(
    saleInvoiceIds: number[],
    options?: { skipUndeletable?: boolean },
  ) {
    return this.bulkDeleteSaleInvoicesService.bulkDeleteSaleInvoices(
      saleInvoiceIds,
      options,
    );
  }

  /**
   * Validates which sale invoices can be deleted.
   * @param {number[]} saleInvoiceIds
   */
  public validateBulkDeleteSaleInvoices(saleInvoiceIds: number[]) {
    return this.validateBulkDeleteSaleInvoicesService.validateBulkDeleteSaleInvoices(
      saleInvoiceIds,
    );
  }

  /**
   * Retrieves the given sale invoice details.
   * @param {ISalesInvoicesFilter} filterDTO
   * @returns {Promise<{ salesInvoices: SaleInvoice[]; pagination: IPaginationMeta; filterMeta: IFilterMeta; }>}
   */
  public getSaleInvoices(filterDTO: Partial<ISalesInvoicesFilter>) {
    return this.getSaleInvoicesService.getSaleInvoices(filterDTO);
  }

  /**
   * Retrieves sale invoice details.
   * @param {number} saleInvoiceId -
   * @return {Promise<ISaleInvoice>}
   */
  public getSaleInvoice(saleInvoiceId: number) {
    return this.getSaleInvoiceService.getSaleInvoice(saleInvoiceId);
  }

  /**
   * Retrieves the sale invoice state.
   * @param {number} tenantId
   * @param {number} saleInvoiceId
   * @returns
   */
  public getSaleInvoiceState() {
    return this.getSaleInvoiceStateService.getSaleInvoiceState();
  }

  /**
   * Mark the given sale invoice as delivered.
   * @param {number} tenantId
   * @param {number} saleInvoiceId
   * @param {ISystemUser} authorizedUser
   * @returns {}
   */
  public deliverSaleInvoice(saleInvoiceId: number) {
    return this.deliverSaleInvoiceService.deliverSaleInvoice(saleInvoiceId);
  }

  /**
   * Retrieves the receivable sale invoices of the given customer.
   * @param {number} tenantId
   * @param {number} customerId
   * @returns
   */
  public getReceivableSaleInvoices(customerId?: number) {
    return this.getReceivableSaleInvoicesService.getPayableInvoices(customerId);
  }

  /**
   * Writes-off the sale invoice on bad debt expense account.
   * @param {number} saleInvoiceId - Sale invoice id.
   * @param {ISaleInvoiceWriteoffDTO} writeoffDTO - Writeoff data.
   * @return {Promise<ISaleInvoice>}
   */
  public async writeOff(
    saleInvoiceId: number,
    writeoffDTO: ISaleInvoiceWriteoffDTO,
  ) {
    return this.writeoffInvoiceService.writeOff(saleInvoiceId, writeoffDTO);
  }

  /**
   * Cancels the written-off sale invoice.
   * @param {number} saleInvoiceId - Sale invoice id.
   * @returns {Promise<ISaleInvoice>}
   */
  public cancelWrittenoff(saleInvoiceId: number) {
    return this.writeoffInvoiceService.cancelWrittenoff(saleInvoiceId);
  }

  /**
   * Retrieve the invoice assocaited payments transactions.
   * @param {number} invoiceId - Invoice id.
   */
  public getInvoicePayments = async (invoiceId: number) => {
    return this.getInvoicePaymentsService.getInvoicePayments(invoiceId);
  };

  /**
   * Retrieves the pdf buffer of the given sale invoice.
   * @param {number} tenantId - Tenant id.
   * @param {number} saleInvoice
   * @returns {Promise<Buffer>}
   */
  public saleInvoicePdf(saleInvoiceId: number) {
    return this.pdfSaleInvoiceService.getSaleInvoicePdf(saleInvoiceId);
  }

  /**
   * Retrieves the html content of the given sale invoice.
   * @param {number} saleInvoiceId - Sale invoice id.
   * @returns {Promise<string>}
   */
  public saleInvoiceHtml(saleInvoiceId: number): Promise<string> {
    return this.pdfSaleInvoiceService.getSaleInvoiceHtml(saleInvoiceId);
  }

  /**
   * Sends the invoice mail of the given sale invoice.
   * @param {number} saleInvoiceId - Sale invoice id.
   * @param {SendInvoiceMailDTO} messageDTO - Message data.
   * @returns {Promise<void>}
   */
  public sendSaleInvoiceMail(
    saleInvoiceId: number,
    messageDTO: SendInvoiceMailDTO,
  ) {
    return this.sendSaleInvoiceMailService.triggerMail(
      saleInvoiceId,
      messageDTO,
    );
  }

  /**
   * Retrieves the default mail options of the given sale invoice.
   * @param {number} saleInvoiceid - Sale invoice id.
   * @returns {Promise<SaleInvoiceMailState>}
   */
  public getSaleInvoiceMailState(
    saleInvoiceid: number,
  ): Promise<SaleInvoiceMailState> {
    return this.getSaleInvoiceMailStateService.getInvoiceMailState(
      saleInvoiceid,
    );
  }

  /**
   * Generate the given sale invoice sharable link.
   * @param {number} saleInvoiceId
   * @param {string} publicity
   * @param {string} expiryTime
   * @returns
   */
  public generateSaleInvoiceSharableLink(
    saleInvoiceId: number,
    publicity: string = 'private',
    expiryTime: string = '',
  ) {
    return this.generateShareLinkService.generatePaymentLink(
      saleInvoiceId,
      publicity,
      expiryTime,
    );
  }
}
