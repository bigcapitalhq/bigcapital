import { Inject } from 'typedi';
import { CreateSaleEstimate } from './CreateSaleEstimate';
import {
  IFilterMeta,
  IPaginationMeta,
  ISaleEstimate,
  ISaleEstimateDTO,
  ISalesEstimatesFilter,
} from '@/interfaces';
import { EditSaleEstimate } from './EditSaleEstimate';
import { DeleteSaleEstimate } from './DeleteSaleEstimate';
import { GetSaleEstimate } from './GetSaleEstimate';
import { GetSaleEstimates } from './GetSaleEstimates';

export class SaleEstimatesApplication {
  @Inject()
  private createSaleEstimateService: CreateSaleEstimate;

  @Inject()
  private editSaleEstimateService: EditSaleEstimate;

  @Inject()
  private deleteSaleEstimateService: DeleteSaleEstimate;

  @Inject()
  private getSaleEstimateService: GetSaleEstimate;

  @Inject()
  private getSaleEstimatesService: GetSaleEstimates;

  /**
   * Create a sale estimate.
   * @async
   * @param {number} tenantId - The tenant id.
   * @param {EstimateDTO} estimate
   * @return {Promise<ISaleEstimate>}
   */
  public createSaleEstimate(
    tenantId: number,
    estimateDTO: ISaleEstimateDTO
  ): Promise<ISaleEstimate> {
    return this.createSaleEstimateService.createEstimate(tenantId, estimateDTO);
  }

  /**
   *
   * @async
   * @param {number} tenantId - The tenant id.
   * @param {Integer} estimateId
   * @param {EstimateDTO} estimate
   * @return {Promise<ISaleEstimate>}
   */
  public editSaleEstimate(
    tenantId: number,
    estimateId: number,
    estimateDTO: ISaleEstimateDTO
  ): Promise<ISaleEstimate> {
    return this.editSaleEstimateService.editEstimate(
      tenantId,
      estimateId,
      estimateDTO
    );
  }

  /**
   *
   */
  public deleteSaleEstimate(
    tenantId: number,
    estimateId: number
  ): Promise<void> {
    return this.deleteSaleEstimateService.deleteEstimate(tenantId, estimateId);
  }

  /**
   *
   * @param tenantId
   * @param estimateId
   * @returns
   */
  public getSaleEstimate(tenantId: number, estimateId: number) {
    return this.getSaleEstimateService.getEstimate(tenantId, estimateId);
  }

  /**
   *
   * @param {number} tenantId
   * @param {ISalesEstimatesFilter} filterDTO
   * @returns 
   */
  public getSaleEstimates(
    tenantId: number,
    filterDTO: ISalesEstimatesFilter
  ): Promise<{
    salesEstimates: ISaleEstimate[];
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    return this.getSaleEstimatesService.estimatesList(tenantId, filterDTO);
  }
}
