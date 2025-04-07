import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { VendorCreditsRefundApplication } from './VendorCreditsRefund.application';
import { RefundVendorCredit } from './models/RefundVendorCredit';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RefundVendorCreditDto } from './dtos/RefundVendorCredit.dto';

@Controller('vendor-credits')
@ApiTags('vendor-credits-refunds')
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
  @ApiOperation({ summary: 'Create a refund for the given vendor credit.' })
  public async createRefundVendorCredit(
    @Param('vendorCreditId') vendorCreditId: string,
    @Body() refundVendorCreditDTO: RefundVendorCreditDto,
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
  @ApiOperation({ summary: 'Delete a refund for the given vendor credit.' })
  public async deleteRefundVendorCredit(
    @Param('refundCreditId') refundCreditId: string,
  ): Promise<void> {
    return this.vendorCreditsRefundApplication.deleteRefundVendorCredit(
      Number(refundCreditId),
    );
  }
}
