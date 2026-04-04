import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TaxRatesApplication } from './TaxRate.application';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { CreateTaxRateDto, EditTaxRateDto } from './dtos/TaxRate.dto';
import { TaxRateResponseDto } from './dtos/TaxRateResponse.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { TaxRateAction } from './TaxRates.types';

@Controller('tax-rates')
@ApiTags('Tax Rates')
@ApiExtraModels(TaxRateResponseDto)
@ApiCommonHeaders()
@UseGuards(AuthorizationGuard, PermissionGuard)
export class TaxRatesController {
  constructor(private readonly taxRatesApplication: TaxRatesApplication) {}

  @Post()
  @RequirePermission(TaxRateAction.CREATE, AbilitySubject.TaxRate)
  @ApiOperation({ summary: 'Create a new tax rate.' })
  @ApiResponse({
    status: 201,
    description: 'The tax rate has been successfully created.',
    schema: { $ref: getSchemaPath(TaxRateResponseDto) },
  })
  public createTaxRate(@Body() createTaxRateDTO: CreateTaxRateDto) {
    return this.taxRatesApplication.createTaxRate(createTaxRateDTO);
  }

  @Put(':id')
  @RequirePermission(TaxRateAction.EDIT, AbilitySubject.TaxRate)
  @ApiOperation({ summary: 'Edit the given tax rate.' })
  @ApiResponse({
    status: 200,
    description: 'The tax rate has been successfully updated.',
    schema: {
      $ref: getSchemaPath(TaxRateResponseDto),
    },
  })
  public editTaxRate(
    @Param('id') taxRateId: number,
    @Body() editTaxRateDTO: EditTaxRateDto,
  ) {
    return this.taxRatesApplication.editTaxRate(taxRateId, editTaxRateDTO);
  }

  @Delete(':id')
  @RequirePermission(TaxRateAction.DELETE, AbilitySubject.TaxRate)
  @ApiOperation({ summary: 'Delete the given tax rate.' })
  @ApiResponse({
    status: 200,
    description: 'The tax rate has been successfully deleted.',
    schema: {
      $ref: getSchemaPath(TaxRateResponseDto),
    },
  })
  public deleteTaxRate(@Param('id') taxRateId: number) {
    return this.taxRatesApplication.deleteTaxRate(taxRateId);
  }

  @Get(':id')
  @RequirePermission(TaxRateAction.VIEW, AbilitySubject.TaxRate)
  @ApiOperation({ summary: 'Retrieves the tax rate details.' })
  @ApiResponse({
    status: 200,
    description: 'The tax rate details have been successfully retrieved.',
    schema: {
      $ref: getSchemaPath(TaxRateResponseDto),
    },
  })
  public getTaxRate(@Param('id') taxRateId: number) {
    return this.taxRatesApplication.getTaxRate(taxRateId);
  }

  @Get()
  @RequirePermission(TaxRateAction.VIEW, AbilitySubject.TaxRate)
  @ApiOperation({ summary: 'Retrieves the tax rates.' })
  @ApiResponse({
    status: 200,
    description: 'The tax rates have been successfully retrieved.',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            $ref: getSchemaPath(TaxRateResponseDto),
          },
        },
      },
    },
  })
  public getTaxRates() {
    return this.taxRatesApplication.getTaxRates();
  }

  @Put(':id/activate')
  @RequirePermission(TaxRateAction.EDIT, AbilitySubject.TaxRate)
  @ApiOperation({ summary: 'Activate the given tax rate.' })
  @ApiResponse({
    status: 200,
    description: 'The tax rate has been successfully activated.',
    schema: {
      $ref: getSchemaPath(TaxRateResponseDto),
    },
  })
  public activateTaxRate(@Param('id') taxRateId: number) {
    return this.taxRatesApplication.activateTaxRate(taxRateId);
  }

  @Put(':id/inactivate')
  @RequirePermission(TaxRateAction.EDIT, AbilitySubject.TaxRate)
  @ApiOperation({ summary: 'Inactivate the given tax rate.' })
  @ApiResponse({
    status: 200,
    description: 'The tax rate has been successfully inactivated.',
    schema: {
      $ref: getSchemaPath(TaxRateResponseDto),
    },
  })
  public inactivateTaxRate(@Param('id') taxRateId: number) {
    return this.taxRatesApplication.inactivateTaxRate(taxRateId);
  }
}
