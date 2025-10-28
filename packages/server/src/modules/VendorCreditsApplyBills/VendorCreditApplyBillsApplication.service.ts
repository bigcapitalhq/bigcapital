import { Injectable } from '@nestjs/common';
import { ApplyVendorCreditToBillsService } from './command/ApplyVendorCreditToBills.service';
import { DeleteApplyVendorCreditToBillService } from './command/DeleteApplyVendorCreditToBill.service';
import { GetAppliedBillsToVendorCreditService } from './queries/GetAppliedBillsToVendorCredit.service';
import { GetVendorCreditToApplyBills } from './queries/GetVendorCreditToApplyBills.service';
import { IVendorCreditApplyToInvoicesDTO } from './types/VendorCreditApplyBills.types';

@Injectable()
export class VendorCreditApplyBillsApplicationService {
  /**
   * @param {ApplyVendorCreditToBillsService} applyVendorCreditToBillsService
   * @param {DeleteApplyVendorCreditToBillService} deleteApplyVendorCreditToBillService
   * @param {GetVendorCreditToApplyBills} getVendorCreditToApplyBillsService
   * @param {GetAppliedBillsToVendorCreditService} getAppliedBillsToVendorCreditService
   */
  constructor(
    private readonly applyVendorCreditToBillsService: ApplyVendorCreditToBillsService,
    private readonly deleteApplyVendorCreditToBillService: DeleteApplyVendorCreditToBillService,
    private readonly getVendorCreditToApplyBillsService: GetVendorCreditToApplyBills,
    private readonly getAppliedBillsToVendorCreditService: GetAppliedBillsToVendorCreditService,
  ) {}

  /**
   * Retrieve bills that valid apply to the given vendor credit.
   * @param {number} vendorCreditId
   * @returns {Promise<any[]>}
   */
  async getVendorCreditToApplyBills(vendorCreditId: number) {
    return this.getVendorCreditToApplyBillsService.getCreditToApplyBills(
      vendorCreditId,
    );
  }

  /**
   * Apply credit note to the given bills.
   * @param {number} vendorCreditId
   * @param {IVendorCreditApplyToInvoicesDTO} applyCreditToBillsDTO
   */
  async applyVendorCreditToBills(
    vendorCreditId: number,
    applyCreditToBillsDTO: IVendorCreditApplyToInvoicesDTO,
  ) {
    return this.applyVendorCreditToBillsService.applyVendorCreditToBills(
      vendorCreditId,
      applyCreditToBillsDTO,
    );
  }

  /**
   * Delete applied bill to the given vendor credit.
   * @param {number} vendorCreditAppliedBillId
   */
  async deleteAppliedBillToVendorCredit(vendorCreditAppliedBillId: number) {
    return this.deleteApplyVendorCreditToBillService.deleteApplyVendorCreditToBills(
      vendorCreditAppliedBillId,
    );
  }

  /**
   * Retrieve applied bills to the given vendor credit.
   * @param {number} vendorCreditId
   * @returns {Promise<any[]>}
   */
  async getAppliedBillsToVendorCredit(vendorCreditId: number) {
    return this.getAppliedBillsToVendorCreditService.getAppliedBills(
      vendorCreditId,
    );
  }
}
