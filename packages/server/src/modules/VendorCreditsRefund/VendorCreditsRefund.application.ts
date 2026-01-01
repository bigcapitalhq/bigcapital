import { Injectable } from '@nestjs/common';
import { DeleteRefundVendorCreditService } from './commands/DeleteRefundVendorCredit.service';
import { RefundVendorCredit } from './models/RefundVendorCredit';
import { CreateRefundVendorCredit } from './commands/CreateRefundVendorCredit.service';
import { RefundVendorCreditDto } from './dtos/RefundVendorCredit.dto';
import { GetRefundVendorCreditsService } from './queries/GetRefundVendorCredits.service';
import { IRefundVendorCreditPOJO } from './types/VendorCreditRefund.types';

@Injectable()
export class VendorCreditsRefundApplication {
  /**
   * @param {CreateRefundVendorCredit} createRefundVendorCreditService
   * @param {DeleteRefundVendorCreditService} deleteRefundVendorCreditService
   * @param {GetRefundVendorCreditsService} getRefundVendorCreditsService
   */
  constructor(
    private readonly createRefundVendorCreditService: CreateRefundVendorCredit,
    private readonly deleteRefundVendorCreditService: DeleteRefundVendorCreditService,
    private readonly getRefundVendorCreditsService: GetRefundVendorCreditsService,
  ) { }

  /**
   * Retrieve the vendor credit refunds graph.
   * @param {number} vendorCreditId - Vendor credit id.
   * @returns {Promise<IRefundVendorCreditPOJO[]>}
   */
  public getVendorCreditRefunds(
    vendorCreditId: number,
  ): Promise<IRefundVendorCreditPOJO[]> {
    return this.getRefundVendorCreditsService.getVendorCreditRefunds(
      vendorCreditId,
    );
  }

  /**
   * Creates a refund vendor credit.
   * @param {number} vendorCreditId
   * @param {IRefundVendorCreditDTO} refundVendorCreditDTO
   * @returns {Promise<RefundVendorCredit>}
   */
  public async createRefundVendorCredit(
    vendorCreditId: number,
    refundVendorCreditDTO: RefundVendorCreditDto,
  ): Promise<RefundVendorCredit> {
    return this.createRefundVendorCreditService.createRefund(
      vendorCreditId,
      refundVendorCreditDTO,
    );
  }

  /**
   * Deletes a refund vendor credit.
   * @param {number} refundCreditId
   * @returns {Promise<void>}
   */
  public async deleteRefundVendorCredit(refundCreditId: number): Promise<void> {
    return this.deleteRefundVendorCreditService.deleteRefundVendorCreditRefund(
      refundCreditId,
    );
  }
}
