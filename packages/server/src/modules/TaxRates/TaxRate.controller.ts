import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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

@Controller('tax-rates')
@ApiTags('Tax Rates')
@ApiExtraModels(TaxRateResponseDto)
@ApiCommonHeaders()
export class TaxRatesController {
  constructor(private readonly taxRatesApplication: TaxRatesApplication) { }

  @Post()
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
  @ApiOperation({ summary: 'Retrieves the tax rate details.' })
  @ApiResponse({
    status: 200,
    description: 'The tax rate details have been successfully retrieved.',
    schema: {
      $ref: getSchemaPath(TaxRateResponseDto),
    },
  })
  public async getTaxRate(@Param('id') taxRateId: number) {
    const taxRate = await this.taxRatesApplication.getTaxRate(taxRateId);
    return { data: taxRate };
  }

  @Get()
  @ApiOperation({ summary: 'Retrieves the tax rates.' })
  @ApiResponse({
    status: 200,
    description: 'The tax rates have been successfully retrieved.',
    schema: {
      type: 'array',
      items: {
        $ref: getSchemaPath(TaxRateResponseDto),
      },
    },
  })
  public async getTaxRates() {
    const taxRates = await this.taxRatesApplication.getTaxRates();
    return { data: taxRates };
  }

  @Put(':id/activate')
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
