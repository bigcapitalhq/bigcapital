import { Module } from '@nestjs/common';
import { BillsApplication } from './Bills.application';
import { CreateBill } from './commands/CreateBill.service';
import { DeleteBill } from './commands/DeleteBill.service';
import { GetBill } from './queries/GetBill';
import { BillDTOTransformer } from './commands/BillDTOTransformer.service';
import { EditBillService } from './commands/EditBill.service';
import { GetDueBills } from './queries/GetDueBills.service';
import { OpenBillService } from './commands/OpenBill.service';
import { BillsValidators } from './commands/BillsValidators.service';
import { ItemsEntriesService } from '../Items/ItemsEntries.service';
import { BranchTransactionDTOTransformer } from '../Branches/integrations/BranchTransactionDTOTransform';
import { BranchesSettingsService } from '../Branches/BranchesSettings';
import { WarehouseTransactionDTOTransform } from '../Warehouses/Integrations/WarehouseTransactionDTOTransform';
import { WarehousesSettings } from '../Warehouses/WarehousesSettings';
import { ItemEntriesTaxTransactions } from '../TaxRates/ItemEntriesTaxTransactions.service';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { BillsController } from './Bills.controller';
import { BillLandedCostsModule } from '../BillLandedCosts/BillLandedCosts.module';
import { BillGLEntriesSubscriber } from './subscribers/BillGLEntriesSubscriber';
import { BillGLEntries } from './commands/BillsGLEntries';
import { LedgerModule } from '../Ledger/Ledger.module';
import { AccountsModule } from '../Accounts/Accounts.module';
import { BillWriteInventoryTransactionsSubscriber } from './subscribers/BillWriteInventoryTransactionsSubscriber';
import { BillInventoryTransactions } from './commands/BillInventoryTransactions';
import { GetBillsService } from './queries/GetBills.service';
import { DynamicListModule } from '../DynamicListing/DynamicList.module';
import { InventoryCostModule } from '../InventoryCost/InventoryCost.module';
import { BillsExportable } from './commands/BillsExportable';
import { BillsImportable } from './commands/BillsImportable';
import { GetBillPaymentTransactionsService } from './queries/GetBillPayments';
import { BulkDeleteBillsService } from './BulkDeleteBills.service';
import { ValidateBulkDeleteBillsService } from './ValidateBulkDeleteBills.service';

@Module({
  imports: [
    BillLandedCostsModule,
    LedgerModule,
    AccountsModule,
    DynamicListModule,
    InventoryCostModule,
  ],
  providers: [
    TenancyContext,
    BillsApplication,
    BranchTransactionDTOTransformer,
    WarehouseTransactionDTOTransform,
    WarehousesSettings,
    ItemEntriesTaxTransactions,
    BranchesSettingsService,
    CreateBill,
    EditBillService,
    GetDueBills,
    OpenBillService,
    GetBill,
    GetBillsService,
    DeleteBill,
    BillDTOTransformer,
    BillsValidators,
    BillGLEntries,
    ItemsEntriesService,
    BillGLEntriesSubscriber,
    BillInventoryTransactions,
    BillWriteInventoryTransactionsSubscriber,
    BillsExportable,
    BillsImportable,
    GetBillPaymentTransactionsService,
    BulkDeleteBillsService,
    ValidateBulkDeleteBillsService,
  ],
  controllers: [BillsController],
  exports: [BillsExportable, BillsImportable],
})
export class BillsModule { }
