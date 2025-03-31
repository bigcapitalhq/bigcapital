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
  IVendorOpeningBalanceEditDTO,
  IVendorsFilter,
} from './types/Vendors.types';
import { PublicRoute } from '../Auth/guards/Jwt.local';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateVendorDto } from './dtos/CreateVendor.dto';
import { EditVendorDto } from './dtos/EditVendor.dto';

@Controller('vendors')
@ApiTags('vendors')
@PublicRoute()
export class VendorsController {
  constructor(private vendorsApplication: VendorsApplication) {}

  @Get()
  @ApiOperation({ summary: 'Retrieves the vendors.' })
  getVendors(@Query() filterDTO: IVendorsFilter) {
    return this.vendorsApplication.getVendors(filterDTO);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieves the vendor details.' })
  getVendor(@Param('id') vendorId: number) {
    return this.vendorsApplication.getVendor(vendorId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new vendor.' })
  createVendor(@Body() vendorDTO: CreateVendorDto) {
    return this.vendorsApplication.createVendor(vendorDTO);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Edit the given vendor.' })
  editVendor(@Param('id') vendorId: number, @Body() vendorDTO: EditVendorDto) {
    return this.vendorsApplication.editVendor(vendorId, vendorDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the given vendor.' })
  deleteVendor(@Param('id') vendorId: number) {
    return this.vendorsApplication.deleteVendor(vendorId);
  }

  @Put(':id/opening-balance')
  @ApiOperation({ summary: 'Edit the given vendor opening balance.' })
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
