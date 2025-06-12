import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { VendorCreditApplyBillsApplicationService } from './VendorCreditApplyBillsApplication.service';
import { IVendorCreditApplyToInvoicesDTO } from './types/VendorCreditApplyBills.types';
import { ApiTags } from '@nestjs/swagger';

@Controller('vendor-credits')
@ApiTags('Vendor Credits Apply Bills')
export class VendorCreditApplyBillsController {
  constructor(
    private readonly vendorCreditApplyBillsApplication: VendorCreditApplyBillsApplicationService,
  ) {}

  @Get(':vendorCreditId/bills-to-apply')
  async getVendorCreditToApplyBills(
    @Param('vendorCreditId') vendorCreditId: number,
  ) {
    return this.vendorCreditApplyBillsApplication.getVendorCreditToApplyBills(
      vendorCreditId,
    );
  }

  @Post(':vendorCreditId/apply-to-bills')
  async applyVendorCreditToBills(
    @Param('vendorCreditId') vendorCreditId: number,
    @Body() applyCreditToBillsDTO: IVendorCreditApplyToInvoicesDTO,
  ) {
    return this.vendorCreditApplyBillsApplication.applyVendorCreditToBills(
      vendorCreditId,
      applyCreditToBillsDTO,
    );
  }

  @Delete('applied-bills/:vendorCreditAppliedBillId')
  async deleteAppliedBillToVendorCredit(
    @Param('vendorCreditAppliedBillId') vendorCreditAppliedBillId: number,
  ) {
    return this.vendorCreditApplyBillsApplication.deleteAppliedBillToVendorCredit(
      vendorCreditAppliedBillId,
    );
  }

  @Get(':vendorCreditId/applied-bills')
  async getAppliedBillsToVendorCredit(
    @Param('vendorCreditId') vendorCreditId: number,
  ) {
    return this.vendorCreditApplyBillsApplication.getAppliedBillsToVendorCredit(
      vendorCreditId,
    );
  }
}
