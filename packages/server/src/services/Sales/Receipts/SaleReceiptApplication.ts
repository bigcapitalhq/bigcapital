import { Inject, Service } from 'typedi';
import { CreateSaleReceipt } from './CreateSaleReceipt';
import {
  IFilterMeta,
  IPaginationMeta,
  ISaleReceipt,
  ISalesReceiptsFilter,
} from '@/interfaces';
import { EditSaleReceipt } from './EditSaleReceipt';
import { GetSaleReceipt } from './GetSaleReceipt';
import { DeleteSaleReceipt } from './DeleteSaleReceipt';
import { GetSaleReceipts } from './GetSaleReceipts';

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

  /**
   *  Creates a new sale receipt with associated entries.
   * @param {number} tenantId
   * @param {} saleReceiptDTO
   * @returns
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
   * @param tenantId
   * @param saleReceiptId
   * @param saleReceiptDTO
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
}
