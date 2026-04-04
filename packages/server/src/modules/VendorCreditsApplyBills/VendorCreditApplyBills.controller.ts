import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { VendorCreditApplyBillsApplicationService } from './VendorCreditApplyBillsApplication.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { ApplyVendorCreditToBillsDto } from './dtos/ApplyVendorCreditToBills.dto';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { VendorCreditAction } from '../VendorCredit/types/VendorCredit.types';

@Controller('vendor-credits')
@ApiTags('Vendor Credits Apply Bills')
@ApiCommonHeaders()
@UseGuards(AuthorizationGuard, PermissionGuard)
export class VendorCreditApplyBillsController {
  constructor(
    private readonly vendorCreditApplyBillsApplication: VendorCreditApplyBillsApplicationService,
  ) {}

  @Get(':vendorCreditId/bills-to-apply')
  @RequirePermission(VendorCreditAction.View, AbilitySubject.VendorCredit)
  @ApiOperation({
    summary: 'Get bills that can be applied with this vendor credit.',
  })
  async getVendorCreditToApplyBills(
    @Param('vendorCreditId') vendorCreditId: number,
  ) {
    return this.vendorCreditApplyBillsApplication.getVendorCreditToApplyBills(
      vendorCreditId,
    );
  }

  @Post(':vendorCreditId/apply-to-bills')
  @RequirePermission(VendorCreditAction.Edit, AbilitySubject.VendorCredit)
  @ApiOperation({ summary: 'Apply vendor credit to the given bills.' })
  @ApiBody({ type: ApplyVendorCreditToBillsDto })
  async applyVendorCreditToBills(
    @Param('vendorCreditId') vendorCreditId: number,
    @Body() applyCreditToBillsDTO: ApplyVendorCreditToBillsDto,
  ) {
    return this.vendorCreditApplyBillsApplication.applyVendorCreditToBills(
      vendorCreditId,
      applyCreditToBillsDTO,
    );
  }

  @Delete('applied-bills/:vendorCreditAppliedBillId')
  @RequirePermission(VendorCreditAction.Edit, AbilitySubject.VendorCredit)
  @ApiOperation({ summary: 'Remove an applied bill from the vendor credit.' })
  async deleteAppliedBillToVendorCredit(
    @Param('vendorCreditAppliedBillId') vendorCreditAppliedBillId: number,
  ) {
    return this.vendorCreditApplyBillsApplication.deleteAppliedBillToVendorCredit(
      vendorCreditAppliedBillId,
    );
  }

  @Get(':vendorCreditId/applied-bills')
  @RequirePermission(VendorCreditAction.View, AbilitySubject.VendorCredit)
  @ApiOperation({ summary: 'Get bills already applied to this vendor credit.' })
  async getAppliedBillsToVendorCredit(
    @Param('vendorCreditId') vendorCreditId: number,
  ) {
    return this.vendorCreditApplyBillsApplication.getAppliedBillsToVendorCredit(
      vendorCreditId,
    );
  }
}
