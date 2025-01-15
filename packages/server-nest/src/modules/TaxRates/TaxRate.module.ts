import { Module } from '@nestjs/common';
import { TransformerInjectable } from '../Transformer/TransformerInjectable.service';
import { TaxRatesController } from './TaxRate.controller';
import { CreateTaxRate } from './commands/CreateTaxRate.service';
import { InactivateTaxRateService } from './commands/InactivateTaxRate';
import { ActivateTaxRateService } from './commands/ActivateTaxRate.service';
import { GetTaxRateService } from './queries/GetTaxRate.service';
import { DeleteTaxRateService } from './commands/DeleteTaxRate.service';
import { EditTaxRateService } from './commands/EditTaxRate.service';
import { CommandTaxRatesValidators } from './commands/CommandTaxRatesValidator.service';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { TaxRatesApplication } from './TaxRate.application';
import { ItemEntriesTaxTransactions } from './ItemEntriesTaxTransactions.service';
import { GetTaxRatesService } from './queries/GetTaxRates.service';

@Module({
  imports: [],
  controllers: [TaxRatesController],
  providers: [
    CreateTaxRate,
    EditTaxRateService,
    DeleteTaxRateService,
    GetTaxRateService,
    GetTaxRatesService,
    ActivateTaxRateService,
    InactivateTaxRateService,
    CommandTaxRatesValidators,
    TransformerInjectable,
    TenancyContext,
    TaxRatesApplication,
    ItemEntriesTaxTransactions
  ],
  exports: [ItemEntriesTaxTransactions],
})
export class TaxRatesModule {}
