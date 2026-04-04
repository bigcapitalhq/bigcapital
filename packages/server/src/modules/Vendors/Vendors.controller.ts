import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { VendorsApplication } from './VendorsApplication.service';
import { VendorOpeningBalanceEditDto } from './dtos/VendorOpeningBalanceEdit.dto';
import {
  ApiExtraModels,
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
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { VendorAction } from '../Customers/types/Customers.types';

@Controller('vendors')
@ApiTags('Vendors')
@ApiExtraModels(ValidateBulkDeleteVendorsResponseDto)
@ApiCommonHeaders()
@UseGuards(AuthorizationGuard, PermissionGuard)
export class VendorsController {
  constructor(private vendorsApplication: VendorsApplication) {}

  @Get()
  @RequirePermission(VendorAction.View, AbilitySubject.Vendor)
  @ApiOperation({ summary: 'Retrieves the vendors.' })
  getVendors(@Query() filterDTO: GetVendorsQueryDto) {
    return this.vendorsApplication.getVendors(filterDTO);
  }

  @Get(':id')
  @RequirePermission(VendorAction.View, AbilitySubject.Vendor)
  @ApiOperation({ summary: 'Retrieves the vendor details.' })
  getVendor(@Param('id') vendorId: number) {
    return this.vendorsApplication.getVendor(vendorId);
  }

  @Post()
  @RequirePermission(VendorAction.Create, AbilitySubject.Vendor)
  @ApiOperation({ summary: 'Create a new vendor.' })
  createVendor(@Body() vendorDTO: CreateVendorDto) {
    return this.vendorsApplication.createVendor(vendorDTO);
  }

  @Put(':id')
  @RequirePermission(VendorAction.Edit, AbilitySubject.Vendor)
  @ApiOperation({ summary: 'Edit the given vendor.' })
  editVendor(@Param('id') vendorId: number, @Body() vendorDTO: EditVendorDto) {
    return this.vendorsApplication.editVendor(vendorId, vendorDTO);
  }

  @Delete(':id')
  @RequirePermission(VendorAction.Delete, AbilitySubject.Vendor)
  @ApiOperation({ summary: 'Delete the given vendor.' })
  deleteVendor(@Param('id') vendorId: number) {
    return this.vendorsApplication.deleteVendor(vendorId);
  }

  @Put(':id/opening-balance')
  @RequirePermission(VendorAction.Edit, AbilitySubject.Vendor)
  @ApiOperation({ summary: 'Edit the given vendor opening balance.' })
  editOpeningBalance(
    @Param('id') vendorId: number,
    @Body() openingBalanceDTO: VendorOpeningBalanceEditDto,
  ) {
    return this.vendorsApplication.editOpeningBalance(
      vendorId,
      openingBalanceDTO,
    );
  }

  @Post('validate-bulk-delete')
  @RequirePermission(VendorAction.Delete, AbilitySubject.Vendor)
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
    return this.vendorsApplication.validateBulkDeleteVendors(bulkDeleteDto.ids);
  }

  @Post('bulk-delete')
  @RequirePermission(VendorAction.Delete, AbilitySubject.Vendor)
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
