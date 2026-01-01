import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { VendorCreditsRefundApplication } from './VendorCreditsRefund.application';
import { RefundVendorCredit } from './models/RefundVendorCredit';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RefundVendorCreditDto } from './dtos/RefundVendorCredit.dto';

@Controller('vendor-credits')
@ApiTags('Vendor Credits Refunds')
export class VendorCreditsRefundController {
  constructor(
    private readonly vendorCreditsRefundApplication: VendorCreditsRefundApplication,
  ) { }

  /**
   * Retrieve the vendor credit refunds graph.
   * @param {number} vendorCreditId - Vendor credit id.
   * @returns {Promise<IRefundVendorCreditPOJO[]>}
   */
  @Get(':vendorCreditId/refund')
  @ApiOperation({ summary: 'Retrieve the vendor credit refunds graph.' })
  public getVendorCreditRefunds(
    @Param('vendorCreditId') vendorCreditId: string,
  ) {
    return this.vendorCreditsRefundApplication.getVendorCreditRefunds(
      Number(vendorCreditId),
    );
  }

  /**
   * Creates a refund vendor credit.
   * @param {number} vendorCreditId
   * @param {IRefundVendorCreditDTO} refundVendorCreditDTO
   * @returns {Promise<RefundVendorCredit>}
   */
  @Post(':vendorCreditId/refund')
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
