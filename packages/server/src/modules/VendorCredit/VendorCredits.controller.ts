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
import { VendorCreditsApplicationService } from './VendorCreditsApplication.service';
import { GetVendorCreditsQueryDto } from './dtos/GetVendorCreditsQuery.dto';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  CreateVendorCreditDto,
  EditVendorCreditDto,
} from './dtos/VendorCredit.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import {
  BulkDeleteDto,
  ValidateBulkDeleteResponseDto,
} from '@/common/dtos/BulkDelete.dto';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { VendorCreditAction } from './types/VendorCredit.types';

@Controller('vendor-credits')
@ApiTags('Vendor Credits')
@ApiCommonHeaders()
@ApiExtraModels(ValidateBulkDeleteResponseDto)
@UseGuards(AuthorizationGuard, PermissionGuard)
export class VendorCreditsController {
  constructor(
    private readonly vendorCreditsApplication: VendorCreditsApplicationService,
  ) {}

  @Post('validate-bulk-delete')
  @RequirePermission(VendorCreditAction.Delete, AbilitySubject.VendorCredit)
  @ApiOperation({
    summary:
      'Validates which vendor credits can be deleted and returns the results.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Validation completed with counts and IDs of deletable and non-deletable vendor credits.',
    schema: {
      $ref: getSchemaPath(ValidateBulkDeleteResponseDto),
    },
  })
  async validateBulkDeleteVendorCredits(
    @Body() bulkDeleteDto: BulkDeleteDto,
  ): Promise<ValidateBulkDeleteResponseDto> {
    return this.vendorCreditsApplication.validateBulkDeleteVendorCredits(
      bulkDeleteDto.ids,
    );
  }

  @Post('bulk-delete')
  @RequirePermission(VendorCreditAction.Delete, AbilitySubject.VendorCredit)
  @ApiOperation({ summary: 'Deletes multiple vendor credits.' })
  @ApiResponse({
    status: 200,
    description: 'Vendor credits deleted successfully',
  })
  async bulkDeleteVendorCredits(
    @Body() bulkDeleteDto: BulkDeleteDto,
  ): Promise<void> {
    return this.vendorCreditsApplication.bulkDeleteVendorCredits(
      bulkDeleteDto.ids,
      { skipUndeletable: bulkDeleteDto.skipUndeletable ?? false },
    );
  }

  @Post()
  @RequirePermission(VendorCreditAction.Create, AbilitySubject.VendorCredit)
  @ApiOperation({ summary: 'Create a new vendor credit.' })
  async createVendorCredit(@Body() dto: CreateVendorCreditDto) {
    return this.vendorCreditsApplication.createVendorCredit(dto);
  }

  @Put(':id/open')
  @RequirePermission(VendorCreditAction.Edit, AbilitySubject.VendorCredit)
  @ApiOperation({ summary: 'Open the given vendor credit.' })
  async openVendorCredit(@Param('id') vendorCreditId: number) {
    return this.vendorCreditsApplication.openVendorCredit(vendorCreditId);
  }

  @Get()
  @RequirePermission(VendorCreditAction.View, AbilitySubject.VendorCredit)
  @ApiOperation({ summary: 'Retrieves the vendor credits.' })
  async getVendorCredits(@Query() filterDTO: GetVendorCreditsQueryDto) {
    return this.vendorCreditsApplication.getVendorCredits(filterDTO);
  }

  @Put(':id')
  @RequirePermission(VendorCreditAction.Edit, AbilitySubject.VendorCredit)
  @ApiOperation({ summary: 'Edit the given vendor credit.' })
  async editVendorCredit(
    @Param('id') vendorCreditId: number,
    @Body() dto: EditVendorCreditDto,
  ) {
    return this.vendorCreditsApplication.editVendorCredit(vendorCreditId, dto);
  }

  @Delete(':id')
  @RequirePermission(VendorCreditAction.Delete, AbilitySubject.VendorCredit)
  @ApiOperation({ summary: 'Delete the given vendor credit.' })
  async deleteVendorCredit(@Param('id') vendorCreditId: number) {
    return this.vendorCreditsApplication.deleteVendorCredit(vendorCreditId);
  }

  @Get(':id')
  @RequirePermission(VendorCreditAction.View, AbilitySubject.VendorCredit)
  @ApiOperation({ summary: 'Retrieves the vendor credit details.' })
  async getVendorCredit(@Param('id') vendorCreditId: number) {
    return this.vendorCreditsApplication.getVendorCredit(vendorCreditId);
  }
}
