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
import {
  CreateSaleReceiptDto,
  EditSaleReceiptDto,
} from './dtos/SaleReceipt.dto';
import { GetSaleReceiptMailStateService } from './queries/GetSaleReceiptMailState.service';
import { BulkDeleteSaleReceiptsService } from './BulkDeleteSaleReceipts.service';
import { ValidateBulkDeleteSaleReceiptsService } from './ValidateBulkDeleteSaleReceipts.service';

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
    private getSaleReceiptMailStateService: GetSaleReceiptMailStateService,
    private bulkDeleteSaleReceiptsService: BulkDeleteSaleReceiptsService,
    private validateBulkDeleteSaleReceiptsService: ValidateBulkDeleteSaleReceiptsService,
  ) { }

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
   * Deletes multiple sale receipts.
   * @param {number[]} saleReceiptIds
   */
  public async bulkDeleteSaleReceipts(
    saleReceiptIds: number[],
    options?: { skipUndeletable?: boolean },
  ) {
    return this.bulkDeleteSaleReceiptsService.bulkDeleteSaleReceipts(
      saleReceiptIds,
      options,
    );
  }

  /**
   * Validates which sale receipts can be deleted.
   * @param {number[]} saleReceiptIds
   */
  public async validateBulkDeleteSaleReceipts(saleReceiptIds: number[]) {
    return this.validateBulkDeleteSaleReceiptsService.validateBulkDeleteSaleReceipts(
      saleReceiptIds,
    );
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
   * Retrieves the current state of the sale receipt.
   * @returns {Promise<ISaleReceiptState>} - A promise resolving to the sale receipt state.
   */
  public getSaleReceiptState(): Promise<ISaleReceiptState> {
    return this.getSaleReceiptStateService.getSaleReceiptState();
  }

  /**
   * Retrieves the given sale receipt html.
   * @param {number} saleReceiptId
   * @returns {Promise<string>}
   */
  public getSaleReceiptHtml(saleReceiptId: number) {
    return this.getSaleReceiptPdfService.saleReceiptHtml(saleReceiptId);
  }

  /**
   * Retrieves the mail state of the given sale receipt.
   * @param {number} saleReceiptId
   */
  public getSaleReceiptMail(
    saleReceiptId: number,
  ): Promise<ISaleReceiptState> {
    return this.getSaleReceiptMailStateService.getMailState(saleReceiptId);
  }
}
