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
import { IVendorCreditsQueryDTO } from './types/VendorCredit.types';
import { PublicRoute } from '../Auth/guards/Jwt.local';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateVendorCreditDto,
  EditVendorCreditDto,
} from './dtos/VendorCredit.dto';

@Controller('vendor-credits')
@ApiTags('vendor-credits')
@PublicRoute()
export class VendorCreditsController {
  constructor(
    private readonly vendorCreditsApplication: VendorCreditsApplicationService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vendor credit.' })
  async createVendorCredit(@Body() dto: CreateVendorCreditDto) {
    return this.vendorCreditsApplication.createVendorCredit(dto);
  }

  @Put(':id/open')
  @ApiOperation({ summary: 'Open the given vendor credit.' })
  async openVendorCredit(@Param('id') vendorCreditId: number) {
    return this.vendorCreditsApplication.openVendorCredit(vendorCreditId);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieves the vendor credits.' })
  async getVendorCredits(@Query() filterDTO: IVendorCreditsQueryDTO) {
    return this.vendorCreditsApplication.getVendorCredits(filterDTO);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Edit the given vendor credit.' })
  async editVendorCredit(
    @Param('id') vendorCreditId: number,
    @Body() dto: EditVendorCreditDto,
  ) {
    return this.vendorCreditsApplication.editVendorCredit(vendorCreditId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the given vendor credit.' })
  async deleteVendorCredit(@Param('id') vendorCreditId: number) {
    return this.vendorCreditsApplication.deleteVendorCredit(vendorCreditId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieves the vendor credit details.' })
  async getVendorCredit(@Param('id') vendorCreditId: number) {
    return this.vendorCreditsApplication.getVendorCredit(vendorCreditId);
  }
}
