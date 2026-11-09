import { Module } from '@nestjs/common';
import { LedgerStorageService } from './LedgerStorage.service';
import { LedgerEntriesStorageService } from './LedgerEntriesStorage.service';
import { LedgerRevertService } from './LedgerStorageRevert.service';
import { LedgerContactsBalanceStorage } from './LedgerContactStorage.service';
import { TenancyModule } from '../Tenancy/Tenancy.module';
import { LedegrAccountsStorage } from './LedgetAccountStorage.service';
import { AccountsModule } from '../Accounts/Accounts.module';
import { AnalyticsModule } from '../Analytics/Analytics.module';
import { RegisterTenancyModel } from '../Tenancy/TenancyModels/Tenancy.module';
import { AccountTransactionTrackingCategory } from '../TrackingCategories/models/AccountTransactionTrackingCategory';

const models = [RegisterTenancyModel(AccountTransactionTrackingCategory)];

@Module({
  imports: [TenancyModule, AccountsModule, AnalyticsModule, ...models],
  providers: [
    LedgerStorageService,
    LedgerEntriesStorageService,
    LedgerRevertService,
    LedgerContactsBalanceStorage,
    LedegrAccountsStorage,
  ],
  exports: [
    LedgerStorageService,
    LedgerEntriesStorageService,
    LedgerRevertService,
    LedegrAccountsStorage,
  ],
})
export class LedgerModule {}
