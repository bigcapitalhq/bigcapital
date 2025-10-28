import { Injectable } from '@nestjs/common';
import { CreateBillPaymentService } from './commands/CreateBillPayment.service';
import { DeleteBillPayment } from './commands/DeleteBillPayment.service';
import { EditBillPayment } from './commands/EditBillPayment.service';
import { GetBillPayment } from './queries/GetBillPayment.service';
import { GetPaymentBills } from './queries/GetPaymentBills.service';
import { CreateBillPaymentDto, EditBillPaymentDto } from './dtos/BillPayment.dto';
import { GetBillPaymentsService } from './queries/GetBillPayments.service';
import { GetBillPaymentsFilterDto } from './dtos/GetBillPaymentsFilter.dto';

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
    private getBillPaymentsService: GetBillPaymentsService,
  ) {}

  /**
   * Creates a bill payment with associated GL entries.
   * @param {IBillPaymentDTO} billPaymentDTO - Create bill payment dto.
   * @returns {Promise<IBillPayment>}
   */
  public createBillPayment(billPaymentDTO: CreateBillPaymentDto) {
    return this.createBillPaymentService.createBillPayment(billPaymentDTO);
  }

  /**
   * Delets the given bill payment with associated GL entries.
   * @param {number} billPaymentId - Bill payment id.
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
    billPaymentDTO: EditBillPaymentDto,
  ) {
    return this.editBillPaymentService.editBillPayment(
      billPaymentId,
      billPaymentDTO,
    );
  }

  /**
   * Retrieves bill payments list.
   * @param {GetBillPaymentsFilterDto} filterDTO - The given bill payments filter dto.
   */
  public getBillPayments(filterDTO: GetBillPaymentsFilterDto) {
    return this.getBillPaymentsService.getBillPayments(filterDTO);
  }

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
