import { Module } from '@nestjs/common';
import { TenancyDatabaseModule } from '../Tenancy/TenancyDB/TenancyDB.module';
import { TransformerInjectable } from '../Transformer/TransformerInjectable.service';
import { ActivateVendorService } from './commands/ActivateVendor.service';
import { CreateEditVendorDTOService } from './commands/CreateEditVendorDTO';
import { CreateVendorService } from './commands/CreateVendor.service';
import { DeleteVendorService } from './commands/DeleteVendor.service';
import { EditOpeningBalanceVendorService } from './commands/EditOpeningBalanceVendor.service';
import { EditVendorService } from './commands/EditVendor.service';
import { GetVendorService } from './queries/GetVendor';
import { VendorValidators } from './commands/VendorValidators';
import { VendorsApplication } from './VendorsApplication.service';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { VendorsController } from './Vendors.controller';
import { GetVendorsService } from './queries/GetVendors.service';
import { DynamicListModule } from '../DynamicListing/DynamicList.module';
import { VendorsExportable } from './VendorsExportable';
import { VendorsImportable } from './VendorsImportable';
import { BulkDeleteVendorsService } from './BulkDeleteVendors.service';
import { ValidateBulkDeleteVendorsService } from './ValidateBulkDeleteVendors.service';
import { LedgerModule } from '../Ledger/Ledger.module';
import { AccountsModule } from '../Accounts/Accounts.module';
import { VendorGLEntries } from './VendorGLEntries';
import { VendorGLEntriesStorage } from './VendorGLEntriesStorage';
import { VendorsWriteGLOpeningSubscriber } from './subscribers/VendorGLEntriesSubscriber';

@Module({
  imports: [TenancyDatabaseModule, DynamicListModule, LedgerModule, AccountsModule],
  controllers: [VendorsController],
  providers: [
    ActivateVendorService,
    CreateEditVendorDTOService,
    CreateVendorService,
    EditVendorService,
    EditOpeningBalanceVendorService,
    GetVendorService,
    GetVendorsService,
    VendorValidators,
    DeleteVendorService,
    VendorsApplication,
    BulkDeleteVendorsService,
    ValidateBulkDeleteVendorsService,
    TransformerInjectable,
    TenancyContext,
    VendorsExportable,
    VendorsImportable,
    VendorGLEntries,
    VendorGLEntriesStorage,
    VendorsWriteGLOpeningSubscriber,
  ],
})
export class VendorsModule { }
