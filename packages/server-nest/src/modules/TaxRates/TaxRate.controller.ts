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
import { PublicRoute } from '../Auth/guards/Jwt.local';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTaxRateDto, EditTaxRateDto } from './dtos/TaxRate.dto';

@Controller('tax-rates')
@ApiTags('tax-rates')
@PublicRoute()
export class TaxRatesController {
  constructor(private readonly taxRatesApplication: TaxRatesApplication) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tax rate.' })
  public createTaxRate(@Body() createTaxRateDTO: CreateTaxRateDto) {
    return this.taxRatesApplication.createTaxRate(createTaxRateDTO);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Edit the given tax rate.' })
  public editTaxRate(
    @Param('id') taxRateId: number,
    @Body() editTaxRateDTO: EditTaxRateDto,
  ) {
    return this.taxRatesApplication.editTaxRate(taxRateId, editTaxRateDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the given tax rate.' })
  public deleteTaxRate(@Param('id') taxRateId: number) {
    return this.taxRatesApplication.deleteTaxRate(taxRateId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieves the tax rate details.' })
  public getTaxRate(@Param('id') taxRateId: number) {
    return this.taxRatesApplication.getTaxRate(taxRateId);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieves the tax rates.' })
  public getTaxRates() {
    return this.taxRatesApplication.getTaxRates();
  }

  @Put(':id/activate')
  @ApiOperation({ summary: 'Activate the given tax rate.' })
  public activateTaxRate(@Param('id') taxRateId: number) {
    return this.taxRatesApplication.activateTaxRate(taxRateId);
  }

  @Put(':id/inactivate')
  @ApiOperation({ summary: 'Inactivate the given tax rate.' })
  public inactivateTaxRate(@Param('id') taxRateId: number) {
    return this.taxRatesApplication.inactivateTaxRate(taxRateId);
  }
}
