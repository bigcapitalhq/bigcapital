import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { VendorCreditsRefundApplication } from './VendorCreditsRefund.application';
import { RefundVendorCredit } from './models/RefundVendorCredit';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RefundVendorCreditDto } from './dtos/RefundVendorCredit.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { VendorCreditAction } from '../VendorCredit/types/VendorCredit.types';

@Controller('vendor-credits')
@ApiTags('Vendor Credits Refunds')
@ApiCommonHeaders()
@UseGuards(AuthorizationGuard, PermissionGuard)
export class VendorCreditsRefundController {
  constructor(
    private readonly vendorCreditsRefundApplication: VendorCreditsRefundApplication,
  ) {}

  /**
   * Retrieve a single refund vendor credit transaction by id.
   * @param {number} refundCreditId
   * @returns {Promise<IRefundVendorCreditPOJO>}
   */
  @Get('refunds/:refundCreditId')
  @RequirePermission(VendorCreditAction.View, AbilitySubject.VendorCredit)
  @ApiOperation({
    summary: 'Retrieve a refund vendor credit transaction by id.',
  })
  public getRefundVendorCreditTransaction(
    @Param('refundCreditId') refundCreditId: string,
  ) {
    return this.vendorCreditsRefundApplication.getRefundVendorCreditTransaction(
      Number(refundCreditId),
    );
  }

  /**
   * Retrieve the vendor credit refunds graph.
   * @param {number} vendorCreditId - Vendor credit id.
   * @returns {Promise<IRefundVendorCreditPOJO[]>}
   */
  @Get(':vendorCreditId/refund')
  @RequirePermission(VendorCreditAction.View, AbilitySubject.VendorCredit)
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
  @RequirePermission(VendorCreditAction.Refund, AbilitySubject.VendorCredit)
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
  @RequirePermission(VendorCreditAction.Refund, AbilitySubject.VendorCredit)
  @ApiOperation({ summary: 'Delete a refund for the given vendor credit.' })
  public async deleteRefundVendorCredit(
    @Param('refundCreditId') refundCreditId: string,
  ): Promise<void> {
    return this.vendorCreditsRefundApplication.deleteRefundVendorCredit(
      Number(refundCreditId),
    );
  }
}
