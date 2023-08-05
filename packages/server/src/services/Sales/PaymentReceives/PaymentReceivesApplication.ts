import {
  IFilterMeta,
  IPaginationMeta,
  IPaymentReceive,
  IPaymentReceiveCreateDTO,
  IPaymentReceiveEditDTO,
  IPaymentReceiveSmsDetails,
  IPaymentReceivesFilter,
  ISystemUser,
} from '@/interfaces';
import { Inject, Service } from 'typedi';
import { CreatePaymentReceive } from './CreatePaymentReceive';
import { EditPaymentReceive } from './EditPaymentReceive';
import { DeletePaymentReceive } from './DeletePaymentReceive';
import { GetPaymentReceives } from './GetPaymentReceives';
import { GetPaymentReceive } from './GetPaymentReceive';
import { GetPaymentReceiveInvoices } from './GetPaymentReceiveInvoices';
import { PaymentReceiveNotifyBySms } from './PaymentReceiveSmsNotify';
import GetPaymentReceivePdf from './GetPaymentReeceivePdf';

@Service()
export class PaymentReceivesApplication {
  @Inject()
  private createPaymentReceiveService: CreatePaymentReceive;

  @Inject()
  private editPaymentReceiveService: EditPaymentReceive;

  @Inject()
  private deletePaymentReceiveService: DeletePaymentReceive;

  @Inject()
  private getPaymentReceivesService: GetPaymentReceives;

  @Inject()
  private getPaymentReceiveService: GetPaymentReceive;

  @Inject()
  private getPaymentReceiveInvoicesService: GetPaymentReceiveInvoices;

  @Inject()
  private paymentSmsNotify: PaymentReceiveNotifyBySms;

  @Inject()
  private getPaymentReceivePdfService: GetPaymentReceivePdf;

  /**
   * Creates a new payment receive.
   * @param {number} tenantId
   * @param {IPaymentReceiveCreateDTO} paymentReceiveDTO
   * @param {ISystemUser} authorizedUser
   * @returns
   */
  public createPaymentReceive(
    tenantId: number,
    paymentReceiveDTO: IPaymentReceiveCreateDTO,
    authorizedUser: ISystemUser
  ) {
    return this.createPaymentReceiveService.createPaymentReceive(
      tenantId,
      paymentReceiveDTO,
      authorizedUser
    );
  }

  /**
   * Edit details the given payment receive with associated entries.
   * @param {number} tenantId
   * @param {number} paymentReceiveId
   * @param {IPaymentReceiveEditDTO} paymentReceiveDTO
   * @param {ISystemUser} authorizedUser
   * @returns
   */
  public editPaymentReceive(
    tenantId: number,
    paymentReceiveId: number,
    paymentReceiveDTO: IPaymentReceiveEditDTO,
    authorizedUser: ISystemUser
  ) {
    return this.editPaymentReceiveService.editPaymentReceive(
      tenantId,
      paymentReceiveId,
      paymentReceiveDTO,
      authorizedUser
    );
  }

  /**
   * deletes the given payment receive.
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
    return this.deletePaymentReceiveService.deletePaymentReceive(
      tenantId,
      paymentReceiveId,
      authorizedUser
    );
  }

  /**
   * Retrieve payment receives paginated and filterable.
   * @param {number} tenantId
   * @param {IPaymentReceivesFilter} filterDTO
   * @returns
   */
  public async getPaymentReceives(
    tenantId: number,
    filterDTO: IPaymentReceivesFilter
  ): Promise<{
    paymentReceives: IPaymentReceive[];
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    return this.getPaymentReceivesService.getPaymentReceives(
      tenantId,
      filterDTO
    );
  }

  /**
   *
   * @param {number} tenantId
   * @param {number} paymentReceiveId
   * @returns  {Promise<IPaymentReceive>}
   */
  public async getPaymentReceive(
    tenantId: number,
    paymentReceiveId: number
  ): Promise<IPaymentReceive> {
    return this.getPaymentReceiveService.getPaymentReceive(
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
  ): Promise<IPaymentReceiveSmsDetails> => {
    return this.paymentSmsNotify.smsDetails(tenantId, paymentReceiveId);
  };

  /**
   * 
   * @param tenantId 
   * @param paymentReceive 
   * @returns 
   */
  public getPaymentReceivePdf = (tenantId: number, paymentReceive) => {
    return this.getPaymentReceivePdfService.getPaymentReceivePdf(
      tenantId,
      paymentReceive
    );
  };
}
