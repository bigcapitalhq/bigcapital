import { Injectable } from '@nestjs/common';
import { CreateBillPaymentService } from './commands/CreateBillPayment.service';
import { DeleteBillPayment } from './commands/DeleteBillPayment.service';
import { EditBillPayment } from './commands/EditBillPayment.service';
// import { GetBillPayments } from './GetBillPayments';
import { GetBillPayment } from './queries/GetBillPayment.service';
import { GetPaymentBills } from './queries/GetPaymentBills.service';
import { IBillPaymentDTO } from './types/BillPayments.types';

/**
 * Bill payments application.
 * @service
 */
@Injectable()
export class BillPaymentsApplication {
  constructor(
    private createBillPaymentService: CreateBillPaymentService,
    private editBillPaymentService: EditBillPayment,
    private deleteBillPaymentService: DeleteBillPayment,
    private getBillPaymentService: GetBillPayment,
    private getPaymentBillsService: GetPaymentBills,
    // private getBillPaymentsService: GetBillPayments,
  ) {}

  /**
   * Creates a bill payment with associated GL entries.
   * @param {IBillPaymentDTO} billPaymentDTO
   * @returns {Promise<IBillPayment>}
   */
  public createBillPayment(billPaymentDTO: IBillPaymentDTO) {
    return this.createBillPaymentService.createBillPayment(billPaymentDTO);
  }

  /**
   * Delets the given bill payment with associated GL entries.
   * @param {number} billPaymentId
   */
  public deleteBillPayment(billPaymentId: number) {
    return this.deleteBillPaymentService.deleteBillPayment(billPaymentId);
  }

  /**
   * Edits the given bill payment with associated GL entries.
   * @param {number} billPaymentId - The given bill payment id.
   * @param {IBillPaymentDTO} billPaymentDTO - The given bill payment DTO.
   * @returns {Promise<IBillPayment>}
   */
  public editBillPayment(
    billPaymentId: number,
    billPaymentDTO: IBillPaymentDTO,
  ) {
    return this.editBillPaymentService.editBillPayment(
      billPaymentId,
      billPaymentDTO,
    );
  }

  /**
   * Retrieves bill payments list.
   * @param {number} tenantId
   * @param filterDTO
   * @returns
   */
  // public getBillPayments(filterDTO: IBillPaymentsFilter) {
  // return this.getBillPaymentsService.getBillPayments(filterDTO);
  // }

  /**
   * Retrieve specific bill payment.
   * @param {number} billPyamentId - The given bill payment id.
   */
  public getBillPayment(billPyamentId: number) {
    return this.getBillPaymentService.getBillPayment(billPyamentId);
  }

  /**
   * Retrieve payment made associated bills.
   * @param {number} billPaymentId - The given bill payment id.
   */
  public getPaymentBills(billPaymentId: number) {
    return this.getPaymentBillsService.getPaymentBills(billPaymentId);
  }
}
