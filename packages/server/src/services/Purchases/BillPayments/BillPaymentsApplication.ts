import { Inject, Service } from 'typedi';
import { IBillPaymentDTO, IBillPayment } from '@/interfaces';
import { CreateBillPayment } from './CreateBillPayment';
import { DeleteBillPayment } from './DeleteBillPayment';

/**
 * Bill payments application.
 * @service
 */
export class BillPaymentsService {
  @Inject()
  private createBillPaymentService: CreateBillPayment;

  @Inject()
  private deleteBillPaymentService: DeleteBillPayment;

  /**
   *
   * @param {number} tenantId
   * @param {IBillPaymentDTO} billPaymentDTO
   * @returns {Promise<IBillPayment>}
   */
  public async createBillPayment(
    tenantId: number,
    billPaymentDTO: IBillPaymentDTO
  ): Promise<IBillPayment> {
    return this.createBillPaymentService.createBillPayment(
      tenantId,
      billPaymentDTO
    );
  }

  /**
   *
   * @param {number} tenantId
   * @param {number} billPaymentId
   */
  public async deleteBillPayment(tenantId: number, billPaymentId: number) {
    return this.deleteBillPaymentService.deleteBillPayment(
      tenantId,
      billPaymentId
    );
  }
}
