import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  DefaultValuePipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { VendorCreditsApplicationService } from './VendorCreditsApplication.service';
import { IVendorCreditsQueryDTO } from './types/VendorCredit.types';
import {
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
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

@Controller('vendor-credits')
@ApiTags('Vendor Credits')
@ApiCommonHeaders()
@ApiExtraModels(ValidateBulkDeleteResponseDto)
export class VendorCreditsController {
  constructor(
    private readonly vendorCreditsApplication: VendorCreditsApplicationService,
  ) { }

  @Post('validate-bulk-delete')
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
  @ApiOperation({ summary: 'Deletes multiple vendor credits.' })
  @ApiQuery({
    name: 'skip_undeletable',
    required: false,
    type: Boolean,
    description:
      'When true, undeletable vendor credits will be skipped and only deletable ones will be removed.',
  })
  @ApiResponse({
    status: 200,
    description: 'Vendor credits deleted successfully',
  })
  async bulkDeleteVendorCredits(
    @Body() bulkDeleteDto: BulkDeleteDto,
    @Query('skip_undeletable', new DefaultValuePipe(false), ParseBoolPipe)
    skipUndeletable: boolean,
  ): Promise<void> {
    return this.vendorCreditsApplication.bulkDeleteVendorCredits(
      bulkDeleteDto.ids,
      { skipUndeletable },
    );
  }

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
