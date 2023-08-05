import { Inject, Service } from 'typedi';
import { IBillPaymentDTO, IBillPayment } from '@/interfaces';
import { CreateBillPayment } from './CreateBillPayment';
import { DeleteBillPayment } from './DeleteBillPayment';
import { EditBillPayment } from './EditBillPayment';
import { GetBillPayments } from './GetBillPayments';
import { GetBillPayment } from './GetBillPayment';
import { GetPaymentBills } from './GetPaymentBills';

/**
 * Bill payments application.
 * @service
 */
@Service()
export class BillPaymentsApplication {
  @Inject()
  private createBillPaymentService: CreateBillPayment;

  @Inject()
  private deleteBillPaymentService: DeleteBillPayment;

  @Inject()
  private editBillPaymentService: EditBillPayment;

  @Inject()
  private getBillPaymentsService: GetBillPayments;

  @Inject()
  private getBillPaymentService: GetBillPayment;

  @Inject()
  private getPaymentBillsService: GetPaymentBills;

  /**
   * Creates a bill payment with associated GL entries.
   * @param {number} tenantId
   * @param {IBillPaymentDTO} billPaymentDTO
   * @returns {Promise<IBillPayment>}
   */
  public createBillPayment(
    tenantId: number,
    billPaymentDTO: IBillPaymentDTO
  ): Promise<IBillPayment> {
    return this.createBillPaymentService.createBillPayment(
      tenantId,
      billPaymentDTO
    );
  }

  /**
   * Delets the given bill payment with associated GL entries.
   * @param {number} tenantId
   * @param {number} billPaymentId
   */
  public deleteBillPayment(tenantId: number, billPaymentId: number) {
    return this.deleteBillPaymentService.deleteBillPayment(
      tenantId,
      billPaymentId
    );
  }

  /**
   * Edits the given bill payment with associated GL entries.
   * @param {number} tenantId
   * @param {number} billPaymentId
   * @param billPaymentDTO
   * @returns {Promise<IBillPayment>}
   */
  public editBillPayment(
    tenantId: number,
    billPaymentId: number,
    billPaymentDTO
  ): Promise<IBillPayment> {
    return this.editBillPaymentService.editBillPayment(
      tenantId,
      billPaymentId,
      billPaymentDTO
    );
  }

  /**
   * Retrieves bill payments list.
   * @param {number} tenantId
   * @param filterDTO
   * @returns
   */
  public getBillPayments(tenantId: number, filterDTO: IBillPaymentsFilter) {
    return this.getBillPaymentsService.getBillPayments(tenantId, filterDTO);
  }

  /**
   * Retrieve specific bill payment.
   * @param {number} tenantId
   * @param {number} billPyamentId
   * @returns
   */
  public getBillPayment(tenantId: number, billPyamentId: number) {
    return this.getBillPaymentService.getBillPayment(tenantId, billPyamentId);
  }

  /**
   * Retrieve payment made associated bills.
   * @param {number} tenantId -
   * @param {number} billPaymentId -
   */
  public getPaymentBills(tenantId: number, billPaymentId: number) {
    return this.getPaymentBillsService.getPaymentBills(tenantId, billPaymentId);
  }
}
