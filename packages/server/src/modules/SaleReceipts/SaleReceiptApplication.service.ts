import { Knex } from 'knex';
import { Injectable } from '@nestjs/common';
import { CreateSaleReceipt } from './commands/CreateSaleReceipt.service';
import { GetSaleReceiptState } from './queries/GetSaleReceiptState.service';
import { SaleReceiptsPdfService } from './queries/SaleReceiptsPdf.service';
import { CloseSaleReceipt } from './commands/CloseSaleReceipt.service';
import { DeleteSaleReceipt } from './commands/DeleteSaleReceipt.service';
import { GetSaleReceipt } from './queries/GetSaleReceipt.service';
import { EditSaleReceipt } from './commands/EditSaleReceipt.service';
import {
  ISaleReceiptState,
  ISalesReceiptsFilter,
  SaleReceiptMailOpts,
  SaleReceiptMailOptsDTO,
} from './types/SaleReceipts.types';
import { GetSaleReceiptsService } from './queries/GetSaleReceipts.service';
import { SaleReceipt } from './models/SaleReceipt';
import { IFilterMeta, IPaginationMeta } from '@/interfaces/Model';
import { SaleReceiptMailNotification } from './commands/SaleReceiptMailNotification';
import { CreateSaleReceiptDto, EditSaleReceiptDto } from './dtos/SaleReceipt.dto';

@Injectable()
export class SaleReceiptApplication {
  constructor(
    private createSaleReceiptService: CreateSaleReceipt,
    private editSaleReceiptService: EditSaleReceipt,
    private getSaleReceiptService: GetSaleReceipt,
    private deleteSaleReceiptService: DeleteSaleReceipt,
    private getSaleReceiptsService: GetSaleReceiptsService,
    private closeSaleReceiptService: CloseSaleReceipt,
    private getSaleReceiptPdfService: SaleReceiptsPdfService,
    private getSaleReceiptStateService: GetSaleReceiptState,
    private saleReceiptNotifyByMailService: SaleReceiptMailNotification,
  ) {}

  /**
   * Creates a new sale receipt with associated entries.
   * @param {ISaleReceiptDTO} saleReceiptDTO
   * @returns {Promise<ISaleReceipt>}
   */
  public async createSaleReceipt(
    saleReceiptDTO: CreateSaleReceiptDto,
    trx?: Knex.Transaction,
  ) {
    return this.createSaleReceiptService.createSaleReceipt(saleReceiptDTO, trx);
  }

  /**
   *  Edit details sale receipt with associated entries.
   * @param {number} tenantId
   * @param {number} saleReceiptId
   * @param {} saleReceiptDTO
   * @returns
   */
  public async editSaleReceipt(
    saleReceiptId: number,
    saleReceiptDTO: EditSaleReceiptDto,
  ) {
    return this.editSaleReceiptService.editSaleReceipt(
      saleReceiptId,
      saleReceiptDTO,
    );
  }

  /**
   * Retrieve sale receipt with associated entries.
   * @param {number} saleReceiptId - Sale receipt identifier.
   * @returns {Promise<ISaleReceipt>}
   */
  public async getSaleReceipt(saleReceiptId: number) {
    return this.getSaleReceiptService.getSaleReceipt(saleReceiptId);
  }

  /**
   * Deletes the sale receipt with associated entries.
   * @param {number} saleReceiptId - Sale receipt identifier.
   * @returns {Promise<void>}
   */
  public async deleteSaleReceipt(saleReceiptId: number) {
    return this.deleteSaleReceiptService.deleteSaleReceipt(saleReceiptId);
  }

  /**
   * Retrieve sales receipts paginated and filterable list.
   * @param {ISalesReceiptsFilter} filterDTO
   * @returns
   */
  public async getSaleReceipts(filterDTO: ISalesReceiptsFilter): Promise<{
    data: SaleReceipt[];
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    return this.getSaleReceiptsService.getSaleReceipts(filterDTO);
  }

  /**
   * Closes the given sale receipt.
   * @param {number} tenantId
   * @param {number} saleReceiptId
   * @returns {Promise<void>}
   */
  public async closeSaleReceipt(saleReceiptId: number) {
    return this.closeSaleReceiptService.closeSaleReceipt(saleReceiptId);
  }

  /**
   * Retrieves the given sale receipt pdf.
   * @param {number} saleReceiptId
   */
  public getSaleReceiptPdf(saleReceiptId: number) {
    return this.getSaleReceiptPdfService.saleReceiptPdf(saleReceiptId);
  }

  /**
   * Notify receipt customer by SMS of the given sale receipt.
   * @param {number} tenantId
   * @param {number} saleReceiptId
   * @returns
   */
  // public saleReceiptNotifyBySms(tenantId: number, saleReceiptId: number) {
  //   return this.saleReceiptNotifyBySmsService.notifyBySms(
  //     tenantId,
  //     saleReceiptId,
  //   );
  // }

  /**
   * Retrieves sms details of the given sale receipt.
   * @param {number} tenantId
   * @param {number} saleReceiptId
   * @returns
   */
  // public getSaleReceiptSmsDetails(tenantId: number, saleReceiptId: number) {
  //   return this.saleReceiptNotifyBySmsService.smsDetails(
  //     tenantId,
  //     saleReceiptId,
  //   );
  // }

  /**
   * Sends the receipt mail of the given sale receipt.
   * @param {number} tenantId
   * @param {number} saleReceiptId
   * @param {SaleReceiptMailOptsDTO} messageOpts
   * @returns {Promise<void>}
   */
  public sendSaleReceiptMail(
    saleReceiptId: number,
    messageOpts: SaleReceiptMailOptsDTO,
  ): Promise<void> {
    return this.saleReceiptNotifyByMailService.triggerMail(
      saleReceiptId,
      messageOpts,
    );
  }

  /**
   * Retrieves the default mail options of the given sale receipt.
   * @param {number} saleReceiptId - Sale receipt identifier.
   * @returns {Promise<SaleReceiptMailOpts>}
   */
  public getSaleReceiptMail(
    saleReceiptId: number,
  ): Promise<SaleReceiptMailOpts> {
    return this.saleReceiptNotifyByMailService.getMailOptions(saleReceiptId);
  }

  /**
   * Retrieves the current state of the sale receipt.
   * @returns {Promise<ISaleReceiptState>} - A promise resolving to the sale receipt state.
   */
  public getSaleReceiptState(): Promise<ISaleReceiptState> {
    return this.getSaleReceiptStateService.getSaleReceiptState();
  }
}
