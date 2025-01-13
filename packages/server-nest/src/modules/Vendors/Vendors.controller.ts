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
import { VendorsApplication } from './VendorsApplication.service';
import {
  IVendorEditDTO,
  IVendorNewDTO,
  IVendorOpeningBalanceEditDTO,
  IVendorsFilter,
} from './types/Vendors.types';
import { PublicRoute } from '../Auth/Jwt.guard';

@Controller('vendors')
@PublicRoute()
export class VendorsController {
  constructor(private vendorsApplication: VendorsApplication) {}

  @Get()
  getVendors(@Query() filterDTO: IVendorsFilter) {
    return this.vendorsApplication.getVendors(filterDTO);
  }

  @Get(':id')
  getVendor(@Param('id') vendorId: number) {
    return this.vendorsApplication.getVendor(vendorId);
  }

  @Post()
  createVendor(@Body() vendorDTO: IVendorNewDTO) {
    return this.vendorsApplication.createVendor(vendorDTO);
  }

  @Put(':id')
  editVendor(@Param('id') vendorId: number, @Body() vendorDTO: IVendorEditDTO) {
    return this.vendorsApplication.editVendor(vendorId, vendorDTO);
  }

  @Delete(':id')
  deleteVendor(@Param('id') vendorId: number) {
    return this.vendorsApplication.deleteVendor(vendorId);
  }

  @Put(':id/opening-balance')
  editOpeningBalance(
    @Param('id') vendorId: number,
    @Body() openingBalanceDTO: IVendorOpeningBalanceEditDTO,
  ) {
    return this.vendorsApplication.editOpeningBalance(
      vendorId,
      openingBalanceDTO,
    );
  }
}
