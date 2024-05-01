import { Inject, Service } from 'typedi';
import { CreateBill } from './CreateBill';
import { EditBill } from './EditBill';
import { GetBill } from './GetBill';
import { GetBills } from './GetBills';
import { DeleteBill } from './DeleteBill';
import {
  IBill,
  IBillDTO,
  IBillEditDTO,
  IBillsFilter,
  IFilterMeta,
  IPaginationMeta,
  ISystemUser,
} from '@/interfaces';
import { GetDueBills } from './GetDueBills';
import { OpenBill } from './OpenBill';
import { GetBillPayments } from './GetBillPayments';

@Service()
export class BillsApplication {
  @Inject()
  private createBillService: CreateBill;

  @Inject()
  private editBillService: EditBill;

  @Inject()
  private getBillService: GetBill;

  @Inject()
  private getBillsService: GetBills;

  @Inject()
  private deleteBillService: DeleteBill;

  @Inject()
  private getDueBillsService: GetDueBills;

  @Inject()
  private openBillService: OpenBill;

  @Inject()
  private getBillPaymentsService: GetBillPayments;

  /**
   * Creates a new bill with associated GL entries.
   * @param {number} tenantId
   * @param {IBillDTO} billDTO
   * @param {ISystemUser} authorizedUser
   * @returns
   */
  public createBill(
    tenantId: number,
    billDTO: IBillDTO,
    authorizedUser: ISystemUser
  ): Promise<IBill> {
    return this.createBillService.createBill(tenantId, billDTO, authorizedUser);
  }

  /**
   * Edits the given bill with associated GL entries.
   * @param {number} tenantId
   * @param {number} billId
   * @param {IBillEditDTO} billDTO
   * @param {ISystemUser} authorizedUser
   * @returns
   */
  public editBill(
    tenantId: number,
    billId: number,
    billDTO: IBillEditDTO,
    authorizedUser: ISystemUser
  ): Promise<IBill> {
    return this.editBillService.editBill(
      tenantId,
      billId,
      billDTO,
      authorizedUser
    );
  }

  /**
   * Deletes the given bill with associated GL entries.
   * @param {number} tenantId
   * @param {number} billId
   * @returns {Promise<void>}
   */
  public deleteBill(tenantId: number, billId: number) {
    return this.deleteBillService.deleteBill(tenantId, billId);
  }

  /**
   * Retrieve bills data table list.
   * @param {number} tenantId -
   * @param {IBillsFilter} billsFilter -
   */
  public getBills(
    tenantId: number,
    filterDTO: IBillsFilter
  ): Promise<{
    bills: IBill[];
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    return this.getBillsService.getBills(tenantId, filterDTO);
  }

  /**
   * Retrieves the given bill details.
   * @param {number} tenantId
   * @param {number} billId
   * @returns
   */
  public getBill(tenantId: number, billId: number): Promise<IBill> {
    return this.getBillService.getBill(tenantId, billId);
  }

  /**
   * Open the given bill.
   * @param {number} tenantId
   * @param {number} billId
   * @returns {Promise<void>}
   */
  public openBill(tenantId: number, billId: number): Promise<void> {
    return this.openBillService.openBill(tenantId, billId);
  }

  /**
   * Retrieves due bills of the given vendor.
   * @param {number} tenantId
   * @param {number} vendorId
   * @returns
   */
  public getDueBills(tenantId: number, vendorId?: number) {
    return this.getDueBillsService.getDueBills(tenantId, vendorId);
  }

  /**
   * Retrieve the specific bill associated payment transactions.
   * @param {number} tenantId
   * @param {number} billId
   */
  public getBillPayments = async (tenantId: number, billId: number) => {
    return this.getBillPaymentsService.getBillPayments(tenantId, billId);
  };
}
