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
import { ICreateTaxRateDTO, IEditTaxRateDTO } from './TaxRates.types';
import { PublicRoute } from '../Auth/Jwt.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('tax-rates')
@ApiTags('tax-rates')
@PublicRoute()
export class TaxRatesController {
  constructor(private readonly taxRatesApplication: TaxRatesApplication) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tax rate.' })
  public createTaxRate(@Body() createTaxRateDTO: ICreateTaxRateDTO) {
    return this.taxRatesApplication.createTaxRate(createTaxRateDTO);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Edit the given tax rate.' })
  public editTaxRate(
    @Param('id') taxRateId: number,
    @Body() editTaxRateDTO: IEditTaxRateDTO,
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
