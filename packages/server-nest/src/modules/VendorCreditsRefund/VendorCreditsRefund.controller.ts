

import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { VendorCreditsRefundApplication } from './VendorCreditsRefund.application';
import { IRefundVendorCreditDTO } from './types/VendorCreditRefund.types';
import { RefundVendorCredit } from './models/RefundVendorCredit';
import { PublicRoute } from '../Auth/Jwt.guard';

@Controller('vendor-credits')
@PublicRoute()
export class VendorCreditsRefundController {
  constructor(
    private readonly vendorCreditsRefundApplication: VendorCreditsRefundApplication,
  ) {}

  /**
   * Creates a refund vendor credit.
   * @param {number} vendorCreditId
   * @param {IRefundVendorCreditDTO} refundVendorCreditDTO
   * @returns {Promise<RefundVendorCredit>}
   */
  @Post(':vendorCreditId/refunds')
  public async createRefundVendorCredit(
    @Param('vendorCreditId') vendorCreditId: string,
    @Body() refundVendorCreditDTO: IRefundVendorCreditDTO,
  ): Promise<RefundVendorCredit> {
    return this.vendorCreditsRefundApplication.createRefundVendorCredit(
      Number(vendorCreditId),
      refundVendorCreditDTO,
    );
  }

  /**
   * Deletes a refund vendor credit.
   * @param {number} refundCreditId
   * @returns {Promise<void>}
   */
  @Delete('refunds/:refundCreditId')
  public async deleteRefundVendorCredit(
    @Param('refundCreditId') refundCreditId: string,
  ): Promise<void> {
    return this.vendorCreditsRefundApplication.deleteRefundVendorCredit(
      Number(refundCreditId),
    );
  }
}
