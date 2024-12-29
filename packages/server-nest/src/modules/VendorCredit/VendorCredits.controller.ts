import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { VendorCreditsApplicationService } from './VendorCreditsApplication.service';
import { IVendorCreditCreateDTO, IVendorCreditEditDTO } from './types/VendorCredit.types';

@Controller('vendor-credits')
export class VendorCreditsController {
  constructor(
    private readonly vendorCreditsApplication: VendorCreditsApplicationService,
  ) {}

  @Post()
  async createVendorCredit(@Body() dto: IVendorCreditCreateDTO) {
    return this.vendorCreditsApplication.createVendorCredit(dto);
  }

  @Put(':id') 
  async editVendorCredit(
    @Param('id') vendorCreditId: number,
    @Body() dto: IVendorCreditEditDTO,
  ) {
    return this.vendorCreditsApplication.editVendorCredit(vendorCreditId, dto);
  }

  @Delete(':id')
  async deleteVendorCredit(@Param('id') vendorCreditId: number) {
    return this.vendorCreditsApplication.deleteVendorCredit(vendorCreditId);
  }

  @Get(':id')
  async getVendorCredit(@Param('id') vendorCreditId: number) {
    return this.vendorCreditsApplication.getVendorCredit(vendorCreditId);
  }
}
