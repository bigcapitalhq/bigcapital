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
import { WriteBillTaxTransactionsSubscriber } from './subscribers/WriteBillTaxTransactionsSubscriber';
import { WriteInvoiceTaxTransactionsSubscriber } from './subscribers/WriteInvoiceTaxTransactionsSubscriber';
import { BillTaxRateValidateSubscriber } from './subscribers/BillTaxRateValidateSubscriber';
import { SaleInvoiceTaxRateValidateSubscriber } from './subscribers/SaleInvoiceTaxRateValidateSubscriber';
import { SyncItemTaxRateOnEditTaxSubscriber } from './subscribers/SyncItemTaxRateOnEditTaxSubscriber';
import { WriteTaxTransactionsItemEntries } from './WriteTaxTransactionsItemEntries';
import { SyncItemTaxRateOnEditTaxRate } from './SyncItemTaxRateOnEditTaxRate';
import { RegisterTenancyModel } from '../Tenancy/TenancyModels/Tenancy.module';
import { TaxRateTransaction } from './models/TaxRateTransaction.model';
import { TaxRatesExportable } from './TaxRatesExportable';
import { TaxRatesImportable } from './TaxRatesImportable';

const models = [RegisterTenancyModel(TaxRateTransaction)];

@Module({
  imports: [...models],
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
    ItemEntriesTaxTransactions,
    WriteBillTaxTransactionsSubscriber,
    WriteInvoiceTaxTransactionsSubscriber,
    BillTaxRateValidateSubscriber,
    SaleInvoiceTaxRateValidateSubscriber,
    SyncItemTaxRateOnEditTaxSubscriber,
    WriteTaxTransactionsItemEntries,
    SyncItemTaxRateOnEditTaxRate,
    TaxRatesExportable,
    TaxRatesImportable
  ],
  exports: [ItemEntriesTaxTransactions, ...models],
})
export class TaxRatesModule {}
