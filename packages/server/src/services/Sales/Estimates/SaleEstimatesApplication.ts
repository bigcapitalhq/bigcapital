import { Inject, Service } from 'typedi';
import { CreateSaleEstimate } from './CreateSaleEstimate';
import {
  IFilterMeta,
  IPaginationMeta,
  IPaymentReceiveSmsDetails,
  ISaleEstimate,
  ISaleEstimateDTO,
  ISalesEstimatesFilter,
} from '@/interfaces';
import { EditSaleEstimate } from './EditSaleEstimate';
import { DeleteSaleEstimate } from './DeleteSaleEstimate';
import { GetSaleEstimate } from './GetSaleEstimate';
import { GetSaleEstimates } from './GetSaleEstimates';
import { DeliverSaleEstimate } from './DeliverSaleEstimate';
import { ApproveSaleEstimate } from './ApproveSaleEstimate';
import { RejectSaleEstimate } from './RejectSaleEstimate';
import { SaleEstimateNotifyBySms } from './SaleEstimateSmsNotify';
import { SaleEstimatesPdf } from './SaleEstimatesPdf';

@Service()
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

  @Inject()
  private deliverSaleEstimateService: DeliverSaleEstimate;

  @Inject()
  private approveSaleEstimateService: ApproveSaleEstimate;

  @Inject()
  private rejectSaleEstimateService: RejectSaleEstimate;

  @Inject()
  private saleEstimateNotifyBySmsService: SaleEstimateNotifyBySms;

  @Inject()
  private saleEstimatesPdfService: SaleEstimatesPdf;

  /**
   * Create a sale estimate.
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
   * Edit the given sale estimate.
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
   * Deletes the given sale estimate.
   * @param {number} tenantId -
   * @param {number} estimateId -
   * @return {Promise<void>}
   */
  public deleteSaleEstimate(
    tenantId: number,
    estimateId: number
  ): Promise<void> {
    return this.deleteSaleEstimateService.deleteEstimate(tenantId, estimateId);
  }

  /**
   * Retrieves the given sale estimate.
   * @param {number} tenantId
   * @param {number} estimateId
   */
  public getSaleEstimate(tenantId: number, estimateId: number) {
    return this.getSaleEstimateService.getEstimate(tenantId, estimateId);
  }

  /**
   * Retrieves the sale estimate.
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
    return this.getSaleEstimatesService.getEstimates(tenantId, filterDTO);
  }

  /**
   * Deliver the given sale estimate.
   * @param {number} tenantId
   * @param {number} saleEstimateId
   * @returns {Promise<void>}
   */
  public deliverSaleEstimate(tenantId: number, saleEstimateId: number) {
    return this.deliverSaleEstimateService.deliverSaleEstimate(
      tenantId,
      saleEstimateId
    );
  }

  /**
   * Approve the given sale estimate.
   * @param {number} tenantId
   * @param {number} saleEstimateId
   * @returns {Promise<void>}
   */
  public approveSaleEstimate(
    tenantId: number,
    saleEstimateId: number
  ): Promise<void> {
    return this.approveSaleEstimateService.approveSaleEstimate(
      tenantId,
      saleEstimateId
    );
  }

  /**
   * Mark the sale estimate as rejected from the customer.
   * @param {number} tenantId
   * @param {number} saleEstimateId
   */
  public async rejectSaleEstimate(
    tenantId: number,
    saleEstimateId: number
  ): Promise<void> {
    return this.rejectSaleEstimateService.rejectSaleEstimate(
      tenantId,
      saleEstimateId
    );
  }

  /**
   * Notify the customer of the given sale estimate by SMS.
   * @param {number} tenantId
   * @param {number} saleEstimateId
   * @returns {Promise<ISaleEstimate>}
   */
  public notifySaleEstimateBySms = async (
    tenantId: number,
    saleEstimateId: number
  ): Promise<ISaleEstimate> => {
    return this.saleEstimateNotifyBySmsService.notifyBySms(
      tenantId,
      saleEstimateId
    );
  };

  /**
   * Retrieve the SMS details of the given payment receive transaction.
   * @param {number} tenantId
   * @param {number} saleEstimateId
   * @returns {Promise<IPaymentReceiveSmsDetails>}
   */
  public getSaleEstimateSmsDetails = (
    tenantId: number,
    saleEstimateId: number
  ): Promise<IPaymentReceiveSmsDetails> => {
    return this.saleEstimateNotifyBySmsService.smsDetails(
      tenantId,
      saleEstimateId
    );
  };

  /**
   *
   * @param {number} tenantId
   * @param {} saleEstimate
   * @returns
   */
  public getSaleEstimatePdf(tenantId: number, saleEstimate) {
    return this.saleEstimatesPdfService.getSaleEstimatePdf(
      tenantId,
      saleEstimate
    );
  }
}
