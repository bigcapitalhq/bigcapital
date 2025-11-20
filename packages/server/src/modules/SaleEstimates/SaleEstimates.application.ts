import { Injectable } from '@nestjs/common';
import { CreateSaleEstimate } from './commands/CreateSaleEstimate.service';
import {
  ISalesEstimatesFilter,
  SaleEstimateMailOptionsDTO,
} from './types/SaleEstimates.types';
import { EditSaleEstimate } from './commands/EditSaleEstimate.service';
import { DeleteSaleEstimate } from './commands/DeleteSaleEstimate.service';
import { GetSaleEstimate } from './queries/GetSaleEstimate.service';
import { DeliverSaleEstimateService } from './commands/DeliverSaleEstimate.service';
import { ApproveSaleEstimateService } from './commands/ApproveSaleEstimate.service';
import { RejectSaleEstimateService } from './commands/RejectSaleEstimate.service';
import { SendSaleEstimateMail } from './commands/SendSaleEstimateMail';
import { GetSaleEstimateState } from './queries/GetSaleEstimateState.service';
import { GetSaleEstimatesService } from './queries/GetSaleEstimates.service';
import { GetSaleEstimatePdf } from './queries/GetSaleEstimatePdf';
import {
  CreateSaleEstimateDto,
  EditSaleEstimateDto,
} from './dtos/SaleEstimate.dto';
import { GetSaleEstimateMailStateService } from './queries/GetSaleEstimateMailState.service';
import { BulkDeleteSaleEstimatesService } from './BulkDeleteSaleEstimates.service';
import { ValidateBulkDeleteSaleEstimatesService } from './ValidateBulkDeleteSaleEstimates.service';

@Injectable()
export class SaleEstimatesApplication {
  constructor(
    private readonly createSaleEstimateService: CreateSaleEstimate,
    private readonly editSaleEstimateService: EditSaleEstimate,
    private readonly deleteSaleEstimateService: DeleteSaleEstimate,
    private readonly getSaleEstimateService: GetSaleEstimate,
    private readonly getSaleEstimatesService: GetSaleEstimatesService,
    private readonly deliverSaleEstimateService: DeliverSaleEstimateService,
    private readonly approveSaleEstimateService: ApproveSaleEstimateService,
    private readonly rejectSaleEstimateService: RejectSaleEstimateService,
    private readonly sendEstimateMailService: SendSaleEstimateMail,
    private readonly getSaleEstimateStateService: GetSaleEstimateState,
    private readonly saleEstimatesPdfService: GetSaleEstimatePdf,
    private readonly getSaleEstimateMailStateService: GetSaleEstimateMailStateService,
    private readonly bulkDeleteSaleEstimatesService: BulkDeleteSaleEstimatesService,
    private readonly validateBulkDeleteSaleEstimatesService: ValidateBulkDeleteSaleEstimatesService,
  ) { }

  /**
   * Create a sale estimate.
   * @param {CreateSaleEstimateDto} estimate - Estimate DTO.
   * @return {Promise<ISaleEstimate>}
   */
  public createSaleEstimate(estimateDTO: CreateSaleEstimateDto) {
    return this.createSaleEstimateService.createEstimate(estimateDTO);
  }

  /**
   * Edit the given sale estimate.
   * @param {number} estimateId - Sale estimate ID.
   * @param {EditSaleEstimateDto} estimate - Estimate DTO.
   * @return {Promise<ISaleEstimate>}
   */
  public editSaleEstimate(
    estimateId: number,
    estimateDTO: EditSaleEstimateDto,
  ) {
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
   * Deletes multiple sale estimates.
   * @param {number[]} saleEstimateIds
   * @return {Promise<void>}
   */
  public bulkDeleteSaleEstimates(
    saleEstimateIds: number[],
    options?: { skipUndeletable?: boolean },
  ) {
    return this.bulkDeleteSaleEstimatesService.bulkDeleteSaleEstimates(
      saleEstimateIds,
      options,
    );
  }

  /**
   * Validates which sale estimates can be deleted.
   * @param {number[]} saleEstimateIds
   */
  public validateBulkDeleteSaleEstimates(saleEstimateIds: number[]) {
    return this.validateBulkDeleteSaleEstimatesService.validateBulkDeleteSaleEstimates(
      saleEstimateIds,
    );
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
  public getSaleEstimates(filterDTO: Partial<ISalesEstimatesFilter>) {
    return this.getSaleEstimatesService.getEstimates(filterDTO);
  }

  /**
   * Deliver the given sale estimate.
   * @param {number} saleEstimateId - Sale estimate id.
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
   * @returns {Promise<[Buffer, string]>}
   */
  public getSaleEstimatePdf(saleEstimateId: number) {
    return this.saleEstimatesPdfService.getSaleEstimatePdf(saleEstimateId);
  }

  /**
   * Send the reminder mail of the given sale estimate.
   * @param {number} saleEstimateId - Sale estimate ID.
   * @param {SaleEstimateMailOptionsDTO} saleEstimateMailOpts - Sale estimate mail options.
   * @returns {Promise<void>}
   */
  public sendSaleEstimateMail(
    saleEstimateId: number,
    saleEstimateMailOpts: SaleEstimateMailOptionsDTO,
  ) {
    return this.sendEstimateMailService.triggerMail(
      saleEstimateId,
      saleEstimateMailOpts,
    );
  }

  /**
   * Retrieves the default mail options of the given sale estimate.
   * @param {number} saleEstimateId
   * @returns {Promise<SaleEstimateMailOptions>}
   */
  public getSaleEstimateMail(saleEstimateId: number) {
    return this.sendEstimateMailService.getMailOptions(saleEstimateId);
  }

  /**
   * Retrieves the current state of the sale estimate.
   * @returns {Promise<ISaleEstimateState>} - A promise resolving to the sale estimate state.
   */
  public getSaleEstimateState() {
    return this.getSaleEstimateStateService.getSaleEstimateState();
  }

  /**
   * Retrieves the sale estimate mail state.
   * @param {number} saleEstimateId
   * @returns {Promise<SaleEstimateMailOptions>}
   */
  public getSaleEstimateMailState(saleEstimateId: number) {
    return this.getSaleEstimateMailStateService.getEstimateMailState(
      saleEstimateId,
    );
  }

  /**
   * Retrieve the HTML content of the given sale estimate.
   * @param {number} saleEstimateId
   */
  public getSaleEstimateHtml(saleEstimateId: number) {
    return this.saleEstimatesPdfService.saleEstimateHtml(saleEstimateId);
  }
}
