import { CreateBill } from './commands/CreateBill.service';
import { EditBillService } from './commands/EditBill.service';
import { GetBill } from './queries/GetBill';
import { DeleteBill } from './commands/DeleteBill.service';
import { IBillDTO, IBillEditDTO, IBillsFilter } from './Bills.types';
import { GetDueBills } from './queries/GetDueBills.service';
import { OpenBillService } from './commands/OpenBill.service';
import { Injectable } from '@nestjs/common';
import { GetBillsService } from './queries/GetBills.service';
import { CreateBillDto, EditBillDto } from './dtos/Bill.dto';
import { GetBillPaymentTransactionsService } from './queries/GetBillPayments';
import { BulkDeleteBillsService } from './BulkDeleteBills.service';
import { ValidateBulkDeleteBillsService } from './ValidateBulkDeleteBills.service';
// import { GetBillPayments } from './queries/GetBillPayments';
// import { GetBills } from './queries/GetBills';

@Injectable()
export class BillsApplication {
  constructor(
    private createBillService: CreateBill,
    private editBillService: EditBillService,
    private getBillService: GetBill,
    private deleteBillService: DeleteBill,
    private getDueBillsService: GetDueBills,
    private openBillService: OpenBillService,
    private getBillsService: GetBillsService,
    private getBillPaymentTransactionsService: GetBillPaymentTransactionsService,
    private bulkDeleteBillsService: BulkDeleteBillsService,
    private validateBulkDeleteBillsService: ValidateBulkDeleteBillsService,
  ) { }

  /**
   * Creates a new bill with associated GL entries.
   * @param {IBillDTO} billDTO
   * @returns
   */
  public createBill(billDTO: CreateBillDto) {
    return this.createBillService.createBill(billDTO);
  }

  /**
   * Edits the given bill with associated GL entries.
   * @param {number} billId
   * @param {IBillEditDTO} billDTO
   * @returns
   */
  public editBill(billId: number, billDTO: EditBillDto) {
    return this.editBillService.editBill(billId, billDTO);
  }

  /**
   * Deletes the given bill with associated GL entries.
   * @param {number} billId - Bill id.
   * @returns {Promise<void>}
   */
  public deleteBill(billId: number) {
    return this.deleteBillService.deleteBill(billId);
  }

  /**
   * Deletes multiple bills.
   * @param {number[]} billIds
   */
  public bulkDeleteBills(
    billIds: number[],
    options?: { skipUndeletable?: boolean },
  ) {
    return this.bulkDeleteBillsService.bulkDeleteBills(billIds, options);
  }

  /**
   * Validates which bills can be deleted.
   * @param {number[]} billIds
   */
  public validateBulkDeleteBills(billIds: number[]) {
    return this.validateBulkDeleteBillsService.validateBulkDeleteBills(billIds);
  }

  /**
   * Retrieve bills data table list.
   * @param {IBillsFilter} billsFilter -
   */
  public getBills(filterDTO: Partial<IBillsFilter>) {
    return this.getBillsService.getBills(filterDTO);
  }

  /**
   * Retrieves the given bill details.
   * @param {number} billId
   * @returns
   */
  public getBill(billId: number) {
    return this.getBillService.getBill(billId);
  }

  /**
   * Open the given bill.
   * @param {number} billId
   * @returns {Promise<void>}
   */
  public openBill(billId: number): Promise<void> {
    return this.openBillService.openBill(billId);
  }

  /**
   * Retrieves due bills of the given vendor.
   * @param {number} tenantId
   * @param {number} vendorId
   * @returns
   */
  public getDueBills(vendorId?: number) {
    return this.getDueBillsService.getDueBills(vendorId);
  }

  /**
   * Retrieve the specific bill associated payment transactions.
   * @param {number} billId
   */
  public getBillPaymentTransactions(billId: number) {
    return this.getBillPaymentTransactionsService.getBillPaymentTransactions(
      billId,
    );
  }
}
