import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { VendorCreditsApplicationService } from './VendorCreditsApplication.service';
import {
  IVendorCreditCreateDTO,
  IVendorCreditEditDTO,
} from './types/VendorCredit.types';
import { PublicRoute } from '../Auth/Jwt.guard';

@Controller('vendor-credits')
@PublicRoute()
export class VendorCreditsController {
  constructor(
    private readonly vendorCreditsApplication: VendorCreditsApplicationService,
  ) {}

  @Post()
  async createVendorCredit(@Body() dto: IVendorCreditCreateDTO) {
    return this.vendorCreditsApplication.createVendorCredit(dto);
  }

  @Put(':id/open')
  async openVendorCredit(@Param('id') vendorCreditId: number) {
    return this.vendorCreditsApplication.openVendorCredit(vendorCreditId);
  }

  @Get()
  async getVendorCredits(@Query() filterDTO: IVendorCreditsFilter) {
    return this.vendorCreditsApplication.getVendorCredits(filterDTO);
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
