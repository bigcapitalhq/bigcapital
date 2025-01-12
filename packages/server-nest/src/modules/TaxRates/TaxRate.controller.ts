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

@Controller('tax-rates')
@PublicRoute()
export class TaxRatesController {
  constructor(private readonly taxRatesApplication: TaxRatesApplication) {}

  @Post()
  public createTaxRate(@Body() createTaxRateDTO: ICreateTaxRateDTO) {
    return this.taxRatesApplication.createTaxRate(createTaxRateDTO);
  }

  @Put(':id')
  public editTaxRate(
    @Param('id') taxRateId: number,
    @Body() editTaxRateDTO: IEditTaxRateDTO,
  ) {
    return this.taxRatesApplication.editTaxRate(taxRateId, editTaxRateDTO);
  }

  @Delete(':id')
  public deleteTaxRate(@Param('id') taxRateId: number) {
    return this.taxRatesApplication.deleteTaxRate(taxRateId);
  }

  @Get(':id')
  public getTaxRate(@Param('id') taxRateId: number) {
    return this.taxRatesApplication.getTaxRate(taxRateId);
  }

  @Get()
  public getTaxRates() {
    return this.taxRatesApplication.getTaxRates();
  }

  @Put(':id/activate')
  public activateTaxRate(@Param('id') taxRateId: number) {
    return this.taxRatesApplication.activateTaxRate(taxRateId);
  }

  @Put(':id/inactivate')
  public inactivateTaxRate(@Param('id') taxRateId: number) {
    return this.taxRatesApplication.inactivateTaxRate(taxRateId);
  }
}
