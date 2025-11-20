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
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { CreateVendorDto } from './dtos/CreateVendor.dto';
import { EditVendorDto } from './dtos/EditVendor.dto';
import { GetVendorsQueryDto } from './dtos/GetVendorsQuery.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import {
  BulkDeleteVendorsDto,
  ValidateBulkDeleteVendorsResponseDto,
} from './dtos/BulkDeleteVendors.dto';

@Controller('vendors')
@ApiTags('Vendors')
@ApiCommonHeaders()
export class VendorsController {
  constructor(private vendorsApplication: VendorsApplication) {}

  @Get()
  @ApiOperation({ summary: 'Retrieves the vendors.' })
  getVendors(@Query() filterDTO: GetVendorsQueryDto) {
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

  @Post('validate-bulk-delete')
  @ApiOperation({
    summary:
      'Validates which vendors can be deleted and returns counts of deletable and non-deletable vendors.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Validation completed. Returns counts and IDs of deletable and non-deletable vendors.',
    schema: { $ref: getSchemaPath(ValidateBulkDeleteVendorsResponseDto) },
  })
  validateBulkDeleteVendors(
    @Body() bulkDeleteDto: BulkDeleteVendorsDto,
  ): Promise<ValidateBulkDeleteVendorsResponseDto> {
    return this.vendorsApplication.validateBulkDeleteVendors(
      bulkDeleteDto.ids,
    );
  }

  @Post('bulk-delete')
  @ApiOperation({ summary: 'Deletes multiple vendors in bulk.' })
  @ApiResponse({
    status: 200,
    description: 'The vendors have been successfully deleted.',
  })
  async bulkDeleteVendors(
    @Body() bulkDeleteDto: BulkDeleteVendorsDto,
  ): Promise<void> {
    return this.vendorsApplication.bulkDeleteVendors(bulkDeleteDto.ids, {
      skipUndeletable: bulkDeleteDto.skipUndeletable ?? false,
    });
  }
}
