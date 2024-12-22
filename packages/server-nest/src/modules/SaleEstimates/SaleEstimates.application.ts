import { CreateSaleEstimate } from './commands/CreateSaleEstimate.service';
import {
  // IFilterMeta,
  // IPaginationMeta,
  // IPaymentReceivedSmsDetails,
  ISaleEstimateDTO,
  // ISalesEstimatesFilter,
  // SaleEstimateMailOptions,
  // SaleEstimateMailOptionsDTO,
} from './types/SaleEstimates.types';
import { EditSaleEstimate } from './commands/EditSaleEstimate.service';
import { DeleteSaleEstimate } from './commands/DeleteSaleEstimate.service';
import { GetSaleEstimate } from './queries/GetSaleEstimate.service';
// import { GetSaleEstimates } from './queries/GetSaleEstimates';
import { DeliverSaleEstimateService } from './commands/DeliverSaleEstimate.service';
import { ApproveSaleEstimateService } from './commands/ApproveSaleEstimate.service';
import { RejectSaleEstimateService } from './commands/RejectSaleEstimate.service';
// import { SaleEstimateNotifyBySms } from './commands/SaleEstimateSmsNotify';
// import { SaleEstimatesPdf } from './queries/SaleEstimatesPdf';
// import { SendSaleEstimateMail } from './commands/SendSaleEstimateMail';
import { GetSaleEstimateState } from './queries/GetSaleEstimateState.service';
import { Injectable } from '@nestjs/common';
import { IFilterMeta, IPaginationMeta } from '@/interfaces/Model';

@Injectable()
export class SaleEstimatesApplication {
  constructor(
    private readonly createSaleEstimateService: CreateSaleEstimate,
    private readonly editSaleEstimateService: EditSaleEstimate,
    private readonly deleteSaleEstimateService: DeleteSaleEstimate,
    private readonly getSaleEstimateService: GetSaleEstimate,
    // private readonly getSaleEstimatesService: GetSaleEstimates,
    private readonly deliverSaleEstimateService: DeliverSaleEstimateService,
    private readonly approveSaleEstimateService: ApproveSaleEstimateService,
    private readonly rejectSaleEstimateService: RejectSaleEstimateService,
    // private readonly saleEstimateNotifyBySmsService: SaleEstimateNotifyBySms,
    // private readonly saleEstimatesPdfService: SaleEstimatesPdf,
    // private readonly sendEstimateMailService: SendSaleEstimateMail,
    private readonly getSaleEstimateStateService: GetSaleEstimateState,
  ) {}

  /**
   * Create a sale estimate.
   * @param {EstimateDTO} estimate - Estimate DTO.
   * @return {Promise<ISaleEstimate>}
   */
  public createSaleEstimate(estimateDTO: ISaleEstimateDTO) {
    return this.createSaleEstimateService.createEstimate(estimateDTO);
  }

  /**
   * Edit the given sale estimate.
   * @param {number} estimateId - Sale estimate ID.
   * @param {EstimateDTO} estimate - Estimate DTO.
   * @return {Promise<ISaleEstimate>}
   */
  public editSaleEstimate(estimateId: number, estimateDTO: ISaleEstimateDTO) {
    return this.editSaleEstimateService.editEstimate(estimateId, estimateDTO);
  }

  /**
   * Deletes the given sale estimate.
   * @param {number} estimateId -
   * @return {Promise<void>}
   */
  public deleteSaleEstimate(estimateId: number) {
    return this.deleteSaleEstimateService.deleteEstimate(estimateId);
  }

  /**
   * Retrieves the given sale estimate.
   * @param {number} estimateId - Sale estimate ID.
   */
  public getSaleEstimate(estimateId: number) {
    return this.getSaleEstimateService.getEstimate(estimateId);
  }

  /**
   * Retrieves the sale estimate.
   * @param {ISalesEstimatesFilter} filterDTO - Sales estimates filter DTO.
   * @returns
   */
  // public getSaleEstimates(filterDTO: ISalesEstimatesFilter) {
  // return this.getSaleEstimatesService.getEstimates(filterDTO);
  // }

  /**
   * Deliver the given sale estimate.
   * @param {number} saleEstimateId
   * @returns {Promise<void>}
   */
  public deliverSaleEstimate(saleEstimateId: number) {
    return this.deliverSaleEstimateService.deliverSaleEstimate(saleEstimateId);
  }

  /**
   * Approve the given sale estimate.
   * @param {number} saleEstimateId - Sale estimate ID.
   * @returns {Promise<void>}
   */
  public approveSaleEstimate(saleEstimateId: number) {
    return this.approveSaleEstimateService.approveSaleEstimate(saleEstimateId);
  }

  /**
   * Mark the sale estimate as rejected from the customer.
   * @param {number} saleEstimateId
   */
  public async rejectSaleEstimate(saleEstimateId: number) {
    return this.rejectSaleEstimateService.rejectSaleEstimate(saleEstimateId);
  }

  /**
   * Notify the customer of the given sale estimate by SMS.
   * @param {number} saleEstimateId - Sale estimate ID.
   * @returns {Promise<ISaleEstimate>}
   */
  public notifySaleEstimateBySms = async (saleEstimateId: number) => {
    // return this.saleEstimateNotifyBySmsService.notifyBySms(
    //   saleEstimateId,
    // );
  };

  /**
   * Retrieve the SMS details of the given payment receive transaction.
   * @param {number} saleEstimateId - Sale estimate ID.
   * @returns {Promise<IPaymentReceivedSmsDetails>}
   */
  public getSaleEstimateSmsDetails = (saleEstimateId: number) => {
    // return this.saleEstimateNotifyBySmsService.smsDetails(
    //   saleEstimateId,
    // );
  };

  /**
   * Retrieve the PDF content of the given sale estimate.
   * @param {number} saleEstimateId - Sale estimate ID.
   * @returns
   */
  public getSaleEstimatePdf(saleEstimateId: number) {
    // return this.saleEstimatesPdfService.getSaleEstimatePdf(
    //   saleEstimateId,
    // );
  }

  /**
   * Send the reminder mail of the given sale estimate.
   * @param {number} saleEstimateId - Sale estimate ID.
   * @returns {Promise<void>}
   */
  public sendSaleEstimateMail() // saleEstimateId: number,
  // saleEstimateMailOpts: SaleEstimateMailOptionsDTO,
  {
    // return this.sendEstimateMailService.triggerMail(
    //   saleEstimateId,
    //   saleEstimateMailOpts,
    // );
  }

  /**
   * Retrieves the default mail options of the given sale estimate.
   * @param {number} saleEstimateId
   * @returns {Promise<SaleEstimateMailOptions>}
   */
  public getSaleEstimateMail(saleEstimateId: number) {
    // return this.sendEstimateMailService.getMailOptions(
    //   saleEstimateId,
    // );
  }

  /**
   * Retrieves the current state of the sale estimate.
   * @returns {Promise<ISaleEstimateState>} - A promise resolving to the sale estimate state.
   */
  public getSaleEstimateState() {
    return this.getSaleEstimateStateService.getSaleEstimateState();
  }
}
