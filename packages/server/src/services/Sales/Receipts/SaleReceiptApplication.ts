import { Inject, Service } from 'typedi';
import { CreateSaleReceipt } from './CreateSaleReceipt';
import {
  IFilterMeta,
  IPaginationMeta,
  ISaleReceipt,
  ISalesReceiptsFilter,
  SaleReceiptMailOpts,
  SaleReceiptMailOptsDTO,
} from '@/interfaces';
import { EditSaleReceipt } from './EditSaleReceipt';
import { GetSaleReceipt } from './GetSaleReceipt';
import { DeleteSaleReceipt } from './DeleteSaleReceipt';
import { GetSaleReceipts } from './GetSaleReceipts';
import { CloseSaleReceipt } from './CloseSaleReceipt';
import { SaleReceiptsPdf } from './SaleReceiptsPdfService';
import { SaleReceiptNotifyBySms } from './SaleReceiptNotifyBySms';
import { SaleReceiptMailNotification } from './SaleReceiptMailNotification';

@Service()
export class SaleReceiptApplication {
  @Inject()
  private createSaleReceiptService: CreateSaleReceipt;

  @Inject()
  private editSaleReceiptService: EditSaleReceipt;

  @Inject()
  private getSaleReceiptService: GetSaleReceipt;

  @Inject()
  private deleteSaleReceiptService: DeleteSaleReceipt;

  @Inject()
  private getSaleReceiptsService: GetSaleReceipts;

  @Inject()
  private closeSaleReceiptService: CloseSaleReceipt;

  @Inject()
  private getSaleReceiptPdfService: SaleReceiptsPdf;

  @Inject()
  private saleReceiptNotifyBySmsService: SaleReceiptNotifyBySms;

  @Inject()
  private saleReceiptNotifyByMailService: SaleReceiptMailNotification;

  /**
   * Creates a new sale receipt with associated entries.
   * @param {number} tenantId
   * @param {} saleReceiptDTO
   * @returns {Promise<ISaleReceipt>}
   */
  public async createSaleReceipt(
    tenantId: number,
    saleReceiptDTO: any
  ): Promise<ISaleReceipt> {
    return this.createSaleReceiptService.createSaleReceipt(
      tenantId,
      saleReceiptDTO
    );
  }

  /**
   *  Edit details sale receipt with associated entries.
   * @param {number} tenantId
   * @param {number} saleReceiptId
   * @param {} saleReceiptDTO
   * @returns
   */
  public async editSaleReceipt(
    tenantId: number,
    saleReceiptId: number,
    saleReceiptDTO: any
  ) {
    return this.editSaleReceiptService.editSaleReceipt(
      tenantId,
      saleReceiptId,
      saleReceiptDTO
    );
  }

  /**
   * Retrieve sale receipt with associated entries.
   * @param {number} tenantId
   * @param {number} saleReceiptId
   * @returns
   */
  public async getSaleReceipt(tenantId: number, saleReceiptId: number) {
    return this.getSaleReceiptService.getSaleReceipt(tenantId, saleReceiptId);
  }

  /**
   * Deletes the sale receipt with associated entries.
   * @param {number} tenantId
   * @param {number} saleReceiptId
   * @returns
   */
  public async deleteSaleReceipt(tenantId: number, saleReceiptId: number) {
    return this.deleteSaleReceiptService.deleteSaleReceipt(
      tenantId,
      saleReceiptId
    );
  }

  /**
   * Retrieve sales receipts paginated and filterable list.
   * @param {number} tenantId
   * @param {ISalesReceiptsFilter} filterDTO
   * @returns
   */
  public async getSaleReceipts(
    tenantId: number,
    filterDTO: ISalesReceiptsFilter
  ): Promise<{
    data: ISaleReceipt[];
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    return this.getSaleReceiptsService.getSaleReceipts(tenantId, filterDTO);
  }

  /**
   * Closes the given sale receipt.
   * @param {number} tenantId
   * @param {number} saleReceiptId
   * @returns {Promise<void>}
   */
  public async closeSaleReceipt(tenantId: number, saleReceiptId: number) {
    return this.closeSaleReceiptService.closeSaleReceipt(
      tenantId,
      saleReceiptId
    );
  }

  /**
   * Retrieves the given sale receipt pdf.
   * @param {number} tenantId
   * @param {number} saleReceiptId
   * @returns
   */
  public getSaleReceiptPdf(tenantId: number, saleReceiptId: number) {
    return this.getSaleReceiptPdfService.saleReceiptPdf(
      tenantId,
      saleReceiptId
    );
  }

  /**
   * Notify receipt customer by SMS of the given sale receipt.
   * @param {number} tenantId
   * @param {number} saleReceiptId
   * @returns
   */
  public saleReceiptNotifyBySms(tenantId: number, saleReceiptId: number) {
    return this.saleReceiptNotifyBySmsService.notifyBySms(
      tenantId,
      saleReceiptId
    );
  }

  /**
   * Retrieves sms details of the given sale receipt.
   * @param {number} tenantId
   * @param {number} saleReceiptId
   * @returns
   */
  public getSaleReceiptSmsDetails(tenantId: number, saleReceiptId: number) {
    return this.saleReceiptNotifyBySmsService.smsDetails(
      tenantId,
      saleReceiptId
    );
  }

  /**
   * Sends the receipt mail of the given sale receipt.
   * @param {number} tenantId
   * @param {number} saleReceiptId
   * @param {SaleReceiptMailOptsDTO} messageOpts
   * @returns {Promise<void>}
   */
  public sendSaleReceiptMail(
    tenantId: number,
    saleReceiptId: number,
    messageOpts: SaleReceiptMailOptsDTO
  ): Promise<void> {
    return this.saleReceiptNotifyByMailService.triggerMail(
      tenantId,
      saleReceiptId,
      messageOpts
    );
  }

  /**
   * Retrieves the default mail options of the given sale receipt.
   * @param {number} tenantId
   * @param {number} saleReceiptId
   * @returns {Promise<SaleReceiptMailOpts>}
   */
  public getSaleReceiptMail(
    tenantId: number,
    saleReceiptId: number
  ): Promise<SaleReceiptMailOpts> {
    return this.saleReceiptNotifyByMailService.getMailOptions(
      tenantId,
      saleReceiptId
    );
  }
}
