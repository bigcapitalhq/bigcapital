import {
  IPaymentsReceivedFilter,
  PaymentReceiveMailOptsDTO,
} from './types/PaymentReceived.types';
import { Injectable } from '@nestjs/common';
import { CreatePaymentReceivedService } from './commands/CreatePaymentReceived.serivce';
import { EditPaymentReceivedService } from './commands/EditPaymentReceived.service';
import { DeletePaymentReceivedService } from './commands/DeletePaymentReceived.service';
import { GetPaymentReceivedService } from './queries/GetPaymentReceived.service';
import { GetPaymentReceivedInvoices } from './queries/GetPaymentReceivedInvoices.service';
import { GetPaymentReceivedPdfService } from './queries/GetPaymentReceivedPdf.service';
import { GetPaymentReceivedStateService } from './queries/GetPaymentReceivedState.service';
import { GetPaymentsReceivedService } from './queries/GetPaymentsReceived.service';
import { SendPaymentReceiveMailNotification } from './commands/PaymentReceivedMailNotification';
import {
  CreatePaymentReceivedDto,
  EditPaymentReceivedDto,
} from './dtos/PaymentReceived.dto';
import { PaymentsReceivedPagesService } from './queries/PaymentsReceivedPages.service';
import { GetPaymentReceivedMailState } from './queries/GetPaymentReceivedMailState.service';
import { BulkDeletePaymentReceivedService } from './BulkDeletePaymentReceived.service';
import { ValidateBulkDeletePaymentReceivedService } from './ValidateBulkDeletePaymentReceived.service';

@Injectable()
export class PaymentReceivesApplication {
  constructor(
    private createPaymentReceivedService: CreatePaymentReceivedService,
    private editPaymentReceivedService: EditPaymentReceivedService,
    private deletePaymentReceivedService: DeletePaymentReceivedService,
    private getPaymentsReceivedService: GetPaymentsReceivedService,
    private getPaymentReceivedService: GetPaymentReceivedService,
    private getPaymentReceiveInvoicesService: GetPaymentReceivedInvoices,
    private sendPaymentReceiveMailNotification: SendPaymentReceiveMailNotification,
    private getPaymentReceivedMailStateService: GetPaymentReceivedMailState,
    private getPaymentReceivePdfService: GetPaymentReceivedPdfService,
    private getPaymentReceivedStateService: GetPaymentReceivedStateService,
    private paymentsReceivedPagesService: PaymentsReceivedPagesService,
    private bulkDeletePaymentReceivedService: BulkDeletePaymentReceivedService,
    private validateBulkDeletePaymentReceivedService: ValidateBulkDeletePaymentReceivedService,
  ) { }

  /**
   * Creates a new payment receive.
   * @param {CreatePaymentReceivedDto} paymentReceiveDTO
   * @returns
   */
  public createPaymentReceived(paymentReceiveDTO: CreatePaymentReceivedDto) {
    return this.createPaymentReceivedService.createPaymentReceived(
      paymentReceiveDTO,
    );
  }

  /**
   * Edit details the given payment receive with associated entries.
   * @param {number} paymentReceiveId - Payment receive id.
   * @param {EditPaymentReceivedDto} paymentReceiveDTO - Payment receive data.
   * @returns
   */
  public editPaymentReceive(
    paymentReceiveId: number,
    paymentReceiveDTO: EditPaymentReceivedDto,
  ) {
    return this.editPaymentReceivedService.editPaymentReceive(
      paymentReceiveId,
      paymentReceiveDTO,
    );
  }

  /**
   * Deletes the given payment receive.
   * @param {number} paymentReceiveId - Payment received id.
   * @returns {Promise<void>}
   */
  public deletePaymentReceive(paymentReceiveId: number) {
    return this.deletePaymentReceivedService.deletePaymentReceive(
      paymentReceiveId,
    );
  }

  /**
   * Deletes multiple payment receives.
   * @param {number[]} paymentReceiveIds
   */
  public bulkDeletePaymentReceives(
    paymentReceiveIds: number[],
    options?: { skipUndeletable?: boolean },
  ) {
    return this.bulkDeletePaymentReceivedService.bulkDeletePaymentReceived(
      paymentReceiveIds,
      options,
    );
  }

  /**
   * Validates which payment receives can be deleted.
   * @param {number[]} paymentReceiveIds
   */
  public validateBulkDeletePaymentReceives(paymentReceiveIds: number[]) {
    return this.validateBulkDeletePaymentReceivedService
      .validateBulkDeletePaymentReceived(paymentReceiveIds);
  }

  /**
   * Retrieve payment receives paginated and filterable.
   * @param {number} tenantId
   * @param {IPaymentsReceivedFilter} filterDTO
   * @returns
   */
  public async getPaymentsReceived(
    filterDTO: Partial<IPaymentsReceivedFilter>,
  ) {
    return this.getPaymentsReceivedService.getPaymentReceives(filterDTO);
  }

  /**
   * Retrieves the given payment receive.
   * @param {number} paymentReceiveId
   * @returns {Promise<IPaymentReceived>}
   */
  public async getPaymentReceive(paymentReceiveId: number) {
    return this.getPaymentReceivedService.getPaymentReceive(paymentReceiveId);
  }

  /**
   * Retrieves associated sale invoices of the given payment receive.
   * @param {number} paymentReceiveId
   * @returns
   */
  public getPaymentReceiveInvoices(paymentReceiveId: number) {
    return this.getPaymentReceiveInvoicesService.getPaymentReceiveInvoices(
      paymentReceiveId,
    );
  }

  /**
   * Notify customer via mail about payment receive details.
   * @param {number} paymentReceiveId
   * @param {PaymentReceiveMailOptsDTO} messageOpts
   * @returns {Promise<void>}
   */
  public notifyPaymentByMail(
    paymentReceiveId: number,
    messageOpts: PaymentReceiveMailOptsDTO,
  ): Promise<void> {
    return this.sendPaymentReceiveMailNotification.triggerMail(
      paymentReceiveId,
      messageOpts,
    );
  }

  /**
   * Retrieves the default mail options of the given payment transaction.
   * @param {number} paymentReceiveId - Payment receive id.
   * @returns {Promise<void>}
   */
  public getPaymentMailOptions(paymentReceiveId: number) {
    return this.getPaymentReceivedMailStateService.getMailOptions(
      paymentReceiveId,
    );
  }

  /**
   * Retrieve pdf content of the given payment receive.
   * @param {number} tenantId
   * @param {PaymentReceive} paymentReceive
   * @returns
   */
  public getPaymentReceivePdf(paymentReceiveId: number) {
    return this.getPaymentReceivePdfService.getPaymentReceivePdf(
      paymentReceiveId,
    );
  }

  /**
   * Retrieves html content of the given payment receive.
   * @param {number} paymentReceivedId 
   * @returns {Promise<string>}
   */
  public getPaymentReceivedHtml(paymentReceivedId: number) {
    return this.getPaymentReceivePdfService.getPaymentReceivedHtml(
      paymentReceivedId,
    );
  }

  /**
   * Retrieves the create/edit initial state of the payment received.
   * @returns {Promise<IPaymentReceivedState>}
   */
  public getPaymentReceivedState() {
    return this.getPaymentReceivedStateService.getPaymentReceivedState();
  }

  /**
   * Retrieve the payment received edit page.
   * @param {number} paymentReceiveId - Payment receive id.
   */
  public getPaymentReceivedEditPage(paymentReceiveId: number) {
    return this.paymentsReceivedPagesService.getPaymentReceiveEditPage(
      paymentReceiveId,
    );
  }
}
