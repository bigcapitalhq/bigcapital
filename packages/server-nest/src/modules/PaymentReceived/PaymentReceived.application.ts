import {
  IPaymentReceivedCreateDTO,
  IPaymentReceivedEditDTO,
  IPaymentReceivedSmsDetails,
  // IPaymentsReceivedFilter,
  // ISystemUser,
  // PaymentReceiveMailOptsDTO,
} from './types/PaymentReceived.types';
import { Injectable } from '@nestjs/common';
import { CreatePaymentReceivedService } from './commands/CreatePaymentReceived.serivce';
import { EditPaymentReceivedService } from './commands/EditPaymentReceived.service';
import { DeletePaymentReceivedService } from './commands/DeletePaymentReceived.service';
// import { GetPaymentReceives } from './queries/GetPaymentsReceived.service';
import { GetPaymentReceivedService } from './queries/GetPaymentReceived.service';
import { GetPaymentReceivedInvoices } from './queries/GetPaymentReceivedInvoices.service';
// import { PaymentReceiveNotifyBySms } from './PaymentReceivedSmsNotify';
import GetPaymentReceivedPdf from './queries/GetPaymentReceivedPdf.service';
// import { SendPaymentReceiveMailNotification } from './PaymentReceivedMailNotification';
import { GetPaymentReceivedStateService } from './queries/GetPaymentReceivedState.service';

@Injectable()
export class PaymentReceivesApplication {
  constructor(
    private createPaymentReceivedService: CreatePaymentReceivedService,
    private editPaymentReceivedService: EditPaymentReceivedService,
    private deletePaymentReceivedService: DeletePaymentReceivedService,
    // private getPaymentsReceivedService: GetPaymentReceives,
    private getPaymentReceivedService: GetPaymentReceivedService,
    private getPaymentReceiveInvoicesService: GetPaymentReceivedInvoices,
    // private paymentSmsNotify: PaymentReceiveNotifyBySms,
    // private paymentMailNotify: SendPaymentReceiveMailNotification,
    private getPaymentReceivePdfService: GetPaymentReceivedPdf,
    private getPaymentReceivedStateService: GetPaymentReceivedStateService,
  ) {}

  /**
   * Creates a new payment receive.
   * @param {IPaymentReceivedCreateDTO} paymentReceiveDTO
   * @returns
   */
  public createPaymentReceived(paymentReceiveDTO: IPaymentReceivedCreateDTO) {
    return this.createPaymentReceivedService.createPaymentReceived(
      paymentReceiveDTO,
    );
  }

  /**
   * Edit details the given payment receive with associated entries.
   * @param {number} tenantId
   * @param {number} paymentReceiveId
   * @param {IPaymentReceivedEditDTO} paymentReceiveDTO
   * @param {ISystemUser} authorizedUser
   * @returns
   */
  public editPaymentReceive(
    paymentReceiveId: number,
    paymentReceiveDTO: IPaymentReceivedEditDTO,
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
   * Retrieve payment receives paginated and filterable.
   * @param {number} tenantId
   * @param {IPaymentsReceivedFilter} filterDTO
   * @returns
   */
  // public async getPaymentReceives(
  //   tenantId: number,
  //   filterDTO: IPaymentsReceivedFilter,
  // ): Promise<{
  //   paymentReceives: IPaymentReceived[];
  //   pagination: IPaginationMeta;
  //   filterMeta: IFilterMeta;
  // }> {
  //   return this.getPaymentsReceivedService.getPaymentReceives(
  //     tenantId,
  //     filterDTO,
  //   );
  // }

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
   * Notify customer via sms about payment receive details.
   * @param {number} tenantId - Tenant id.
   * @param {number} paymentReceiveid - Payment receive id.
   */
  // public notifyPaymentBySms(tenantId: number, paymentReceiveid: number) {
  //   return this.paymentSmsNotify.notifyBySms(tenantId, paymentReceiveid);
  // }

  /**
   * Retrieve the SMS details of the given invoice.
   * @param {number} tenantId - Tenant id.
   * @param {number} paymentReceiveid - Payment receive id.
   */
  // public getPaymentSmsDetails = async (
  //   tenantId: number,
  //   paymentReceiveId: number,
  // ): Promise<IPaymentReceivedSmsDetails> => {
  //   return this.paymentSmsNotify.smsDetails(tenantId, paymentReceiveId);
  // };

  /**
   * Notify customer via mail about payment receive details.
   * @param {number} tenantId
   * @param {number} paymentReceiveId
   * @param {IPaymentReceiveMailOpts} messageOpts
   * @returns {Promise<void>}
   */
  // public notifyPaymentByMail(
  //   tenantId: number,
  //   paymentReceiveId: number,
  //   messageOpts: PaymentReceiveMailOptsDTO,
  // ): Promise<void> {
  //   return this.paymentMailNotify.triggerMail(
  //     tenantId,
  //     paymentReceiveId,
  //     messageOpts,
  //   );
  // }

  /**
   * Retrieves the default mail options of the given payment transaction.
   * @param {number} tenantId
   * @param {number} paymentReceiveId
   * @returns {Promise<void>}
   */
  // public getPaymentMailOptions(tenantId: number, paymentReceiveId: number) {
  //   return this.paymentMailNotify.getMailOptions(tenantId, paymentReceiveId);
  // }

  /**
   * Retrieve pdf content of the given payment receive.
   * @param {number} tenantId
   * @param {PaymentReceive} paymentReceive
   * @returns
   */
  public getPaymentReceivePdf = (
    tenantId: number,
    paymentReceiveId: number,
  ) => {
    return this.getPaymentReceivePdfService.getPaymentReceivePdf(
      paymentReceiveId,
    );
  };

  /**
   * Retrieves the create/edit initial state of the payment received.
   * @returns {Promise<IPaymentReceivedState>}
   */
  public getPaymentReceivedState = () => {
    return this.getPaymentReceivedStateService.getPaymentReceivedState();
  };
}
