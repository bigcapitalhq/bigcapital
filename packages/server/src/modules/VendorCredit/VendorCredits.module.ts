import { Module } from '@nestjs/common';
import { CreateVendorCreditService } from './commands/CreateVendorCredit.service';
import { DeleteVendorCreditService } from './commands/DeleteVendorCredit.service';
import { EditVendorCreditService } from './commands/EditVendorCredit.service';
import { VendorCreditDTOTransformService } from './commands/VendorCreditDTOTransform.service';
import { VendorCreditAutoIncrementService } from './commands/VendorCreditAutoIncrement.service';
import { GetRefundVendorCreditService } from '../VendorCreditsRefund/queries/GetRefundVendorCredit.service';
import { GetVendorCreditService } from './queries/GetVendorCredit.service';
import { VendorCreditsController } from './VendorCredits.controller';
import { ItemsModule } from '../Items/Items.module';
import { TemplateInjectableModule } from '../TemplateInjectable/TemplateInjectable.module';
import { AutoIncrementOrdersModule } from '../AutoIncrementOrders/AutoIncrementOrders.module';
import { ChromiumlyTenancyModule } from '../ChromiumlyTenancy/ChromiumlyTenancy.module';
import { PdfTemplatesModule } from '../PdfTemplate/PdfTemplates.module';
import { BranchesModule } from '../Branches/Branches.module';
import { WarehousesModule } from '../Warehouses/Warehouses.module';
import { VendorCreditsApplicationService } from './VendorCreditsApplication.service';
import { OpenVendorCreditService } from './commands/OpenVendorCredit.service';
import { VendorCreditGlEntriesSubscriber } from './subscribers/VendorCreditGLEntriesSubscriber';
import { VendorCreditGLEntries } from './commands/VendorCreditGLEntries';
import { LedgerModule } from '../Ledger/Ledger.module';
import { AccountsModule } from '../Accounts/Accounts.module';
import { VendorCreditInventoryTransactionsSubscriber } from './subscribers/VendorCreditInventoryTransactionsSusbcriber';
import { VendorCreditAutoSerialSubscriber } from './subscribers/VendorCreditAutoSerialSubscriber';
import { VendorCreditInventoryTransactions } from './commands/VendorCreditInventoryTransactions';
import { GetVendorCreditsService } from './queries/GetVendorCredits.service';
import { DynamicListModule } from '../DynamicListing/DynamicList.module';
import { InventoryCostModule } from '../InventoryCost/InventoryCost.module';
import { VendorCreditsExportable } from './commands/VendorCreditsExportable';
import { VendorCreditsImportable } from './commands/VendorCreditsImportable';

@Module({
  imports: [
    ItemsModule,
    PdfTemplatesModule,
    ChromiumlyTenancyModule,
    TemplateInjectableModule,
    AutoIncrementOrdersModule,
    BranchesModule,
    WarehousesModule,
    LedgerModule,
    AccountsModule,
    DynamicListModule,
    InventoryCostModule,
  ],
  providers: [
    CreateVendorCreditService,
    DeleteVendorCreditService,
    EditVendorCreditService,
    VendorCreditDTOTransformService,
    VendorCreditAutoIncrementService,
    GetRefundVendorCreditService,
    GetVendorCreditService,
    GetVendorCreditsService,
    VendorCreditsApplicationService,
    OpenVendorCreditService,
    VendorCreditGLEntries,
    VendorCreditGlEntriesSubscriber,
    VendorCreditInventoryTransactions,
    VendorCreditInventoryTransactionsSubscriber,
    VendorCreditAutoSerialSubscriber,
    VendorCreditsExportable,
    VendorCreditsImportable,
  ],
  exports: [
    CreateVendorCreditService,
    DeleteVendorCreditService,
    EditVendorCreditService,
    VendorCreditDTOTransformService,
    VendorCreditAutoIncrementService,
    GetRefundVendorCreditService,
    GetVendorCreditService,
    VendorCreditsApplicationService,
    OpenVendorCreditService,
    VendorCreditsExportable,
    VendorCreditsImportable,
  ],
  controllers: [VendorCreditsController],
})
export class VendorCreditsModule { }
