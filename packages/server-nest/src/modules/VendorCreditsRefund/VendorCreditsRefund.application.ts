import { Injectable } from '@nestjs/common';
import { DeleteRefundVendorCreditService } from './commands/DeleteRefundVendorCredit.service';
import { RefundVendorCredit } from './models/RefundVendorCredit';
import { CreateRefundVendorCredit } from './commands/CreateRefundVendorCredit.service';
import { IRefundVendorCreditDTO } from './types/VendorCreditRefund.types';

@Injectable()
export class VendorCreditsRefundApplication {
  /**
   * @param {CreateRefundVendorCredit} createRefundVendorCreditService
   * @param {DeleteRefundVendorCreditService} deleteRefundVendorCreditService
   */
  constructor(
    private readonly createRefundVendorCreditService: CreateRefundVendorCredit,
    private readonly deleteRefundVendorCreditService: DeleteRefundVendorCreditService,
  ) {}

  /**
   * Creates a refund vendor credit.
   * @param {number} vendorCreditId
   * @param {IRefundVendorCreditDTO} refundVendorCreditDTO
   * @returns {Promise<RefundVendorCredit>}
   */
  public async createRefundVendorCredit(
    vendorCreditId: number,
    refundVendorCreditDTO: IRefundVendorCreditDTO,
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
