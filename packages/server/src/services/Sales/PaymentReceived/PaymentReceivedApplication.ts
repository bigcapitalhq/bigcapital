import {
  IFilterMeta,
  IPaginationMeta,
  IPaymentReceived,
  IPaymentReceivedCreateDTO,
  IPaymentReceivedEditDTO,
  IPaymentReceivedSmsDetails,
  IPaymentsReceivedFilter,
  ISystemUser,
  PaymentReceiveMailOptsDTO,
} from '@/interfaces';
import { Inject, Service } from 'typedi';
import { CreatePaymentReceived } from './CreatePaymentReceived';
import { EditPaymentReceived } from './EditPaymentReceived';
import { DeletePaymentReceived } from './DeletePaymentReceived';
import { GetPaymentReceives } from './GetPaymentsReceived';
import { GetPaymentReceived } from './GetPaymentReceived';
import { GetPaymentReceivedInvoices } from './GetPaymentReceivedInvoices';
import { PaymentReceiveNotifyBySms } from './PaymentReceivedSmsNotify';
import GetPaymentReceivedPdf from './GetPaymentReceivedPdf';
import { SendPaymentReceiveMailNotification } from './PaymentReceivedMailNotification';
import { GetPaymentReceivedState } from './GetPaymentReceivedState';
import { GetPaymentReceivedMailState } from './GetPaymentReceivedMailState';

@Service()
export class PaymentReceivesApplication {
  @Inject()
  private createPaymentReceivedService: CreatePaymentReceived;

  @Inject()
  private editPaymentReceivedService: EditPaymentReceived;

  @Inject()
  private deletePaymentReceivedService: DeletePaymentReceived;

  @Inject()
  private getPaymentsReceivedService: GetPaymentReceives;

  @Inject()
  private getPaymentReceivedService: GetPaymentReceived;

  @Inject()
  private getPaymentReceiveInvoicesService: GetPaymentReceivedInvoices;

  @Inject()
  private paymentSmsNotify: PaymentReceiveNotifyBySms;

  @Inject()
  private paymentMailNotify: SendPaymentReceiveMailNotification;

  @Inject()
  private getPaymentReceivePdfService: GetPaymentReceivedPdf;

  @Inject()
  private getPaymentReceivedStateService: GetPaymentReceivedState;

  @Inject()
  private getPaymentReceivedMailStateService: GetPaymentReceivedMailState;

  /**
   * Creates a new payment receive.
   * @param {number} tenantId
   * @param {IPaymentReceivedCreateDTO} paymentReceiveDTO
   * @param {ISystemUser} authorizedUser
   * @returns
   */
  public createPaymentReceived(
    tenantId: number,
    paymentReceiveDTO: IPaymentReceivedCreateDTO,
    authorizedUser: ISystemUser
  ) {
    return this.createPaymentReceivedService.createPaymentReceived(
      tenantId,
      paymentReceiveDTO,
      authorizedUser
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
    tenantId: number,
    paymentReceiveId: number,
    paymentReceiveDTO: IPaymentReceivedEditDTO,
    authorizedUser: ISystemUser
  ) {
    return this.editPaymentReceivedService.editPaymentReceive(
      tenantId,
      paymentReceiveId,
      paymentReceiveDTO,
      authorizedUser
    );
  }

  /**
   * Deletes the given payment receive.
   * @param {number} tenantId
   * @param {number} paymentReceiveId
   * @param {ISystemUser} authorizedUser
   * @returns
   */
  public deletePaymentReceive(
    tenantId: number,
    paymentReceiveId: number,
    authorizedUser: ISystemUser
  ) {
    return this.deletePaymentReceivedService.deletePaymentReceive(
      tenantId,
      paymentReceiveId,
      authorizedUser
    );
  }

  /**
   * Retrieve payment receives paginated and filterable.
   * @param {number} tenantId
   * @param {IPaymentsReceivedFilter} filterDTO
   * @returns
   */
  public async getPaymentReceives(
    tenantId: number,
    filterDTO: IPaymentsReceivedFilter
  ): Promise<{
    paymentReceives: IPaymentReceived[];
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    return this.getPaymentsReceivedService.getPaymentReceives(
      tenantId,
      filterDTO
    );
  }

  /**
   * Retrieves the given payment receive.
   * @param {number} tenantId
   * @param {number} paymentReceiveId
   * @returns  {Promise<IPaymentReceived>}
   */
  public async getPaymentReceive(
    tenantId: number,
    paymentReceiveId: number
  ): Promise<IPaymentReceived> {
    return this.getPaymentReceivedService.getPaymentReceive(
      tenantId,
      paymentReceiveId
    );
  }

  /**
   * Retrieves associated sale invoices of the given payment receive.
   * @param {number} tenantId
   * @param {number} paymentReceiveId
   * @returns
   */
  public getPaymentReceiveInvoices(tenantId: number, paymentReceiveId: number) {
    return this.getPaymentReceiveInvoicesService.getPaymentReceiveInvoices(
      tenantId,
      paymentReceiveId
    );
  }

  /**
   * Notify customer via sms about payment receive details.
   * @param {number} tenantId - Tenant id.
   * @param {number} paymentReceiveid - Payment receive id.
   */
  public notifyPaymentBySms(tenantId: number, paymentReceiveid: number) {
    return this.paymentSmsNotify.notifyBySms(tenantId, paymentReceiveid);
  }

  /**
   * Retrieve the SMS details of the given invoice.
   * @param {number} tenantId - Tenant id.
   * @param {number} paymentReceiveid - Payment receive id.
   */
  public getPaymentSmsDetails = async (
    tenantId: number,
    paymentReceiveId: number
  ): Promise<IPaymentReceivedSmsDetails> => {
    return this.paymentSmsNotify.smsDetails(tenantId, paymentReceiveId);
  };

  /**
   * Notify customer via mail about payment receive details.
   * @param {number} tenantId
   * @param {number} paymentReceiveId
   * @param {IPaymentReceiveMailOpts} messageOpts
   * @returns {Promise<void>}
   */
  public notifyPaymentByMail(
    tenantId: number,
    paymentReceiveId: number,
    messageOpts: PaymentReceiveMailOptsDTO
  ): Promise<void> {
    return this.paymentMailNotify.triggerMail(
      tenantId,
      paymentReceiveId,
      messageOpts
    );
  }

  /**
   * Retrieves the default mail options of the given payment transaction.
   * @param {number} tenantId - Tenant id.
   * @param {number} paymentReceiveId - Payment received id.
   * @returns {Promise<void>}
   */
  public getPaymentMailOptions(tenantId: number, paymentReceiveId: number) {
    return this.getPaymentReceivedMailStateService.getMailOptions(
      tenantId,
      paymentReceiveId
    );
  }

  /**
   * Retrieve pdf content of the given payment receive.
   * @param {number} tenantId
   * @param {PaymentReceive} paymentReceive
   * @returns
   */
  public getPaymentReceivePdf = (
    tenantId: number,
    paymentReceiveId: number
  ) => {
    return this.getPaymentReceivePdfService.getPaymentReceivePdf(
      tenantId,
      paymentReceiveId
    );
  };

  /**
   * Retrieves the given payment receive html document.
   * @param {number} tenantId
   * @param {number} paymentReceiveId
   * @returns {Promise<string>}
   */
  public getPaymentReceivedHtml = (
    tenantId: number,
    paymentReceiveId: number
  ) => {
    return this.getPaymentReceivePdfService.getPaymentReceivedHtml(
      tenantId,
      paymentReceiveId
    );
  };

  /**
   * Retrieves the create/edit initial state of the payment received.
   * @param {number} tenantId - The ID of the tenant.
   * @returns {Promise<IPaymentReceivedState>}
   */
  public getPaymentReceivedState = (tenantId: number) => {
    return this.getPaymentReceivedStateService.getPaymentReceivedState(
      tenantId
    );
  };
}
