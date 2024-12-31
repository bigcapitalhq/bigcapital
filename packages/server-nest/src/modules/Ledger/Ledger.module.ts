import { Module } from '@nestjs/common';
import { LedgerStorageService } from './LedgerStorage.service';
import { LedgerEntriesStorageService } from './LedgerEntriesStorage.service';
import { LedgerRevertService } from './LedgerStorageRevert.service';
import { LedgerContactsBalanceStorage } from './LedgerContactStorage.service';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { LedegrAccountsStorage } from './LedgetAccountStorage.service';
import { AccountsModule } from '../Accounts/Accounts.module';

@Module({
  imports: [AccountsModule],
  providers: [
    LedgerStorageService,
    LedgerEntriesStorageService,
    LedgerRevertService,
    LedgerContactsBalanceStorage,
    LedegrAccountsStorage,
    TenancyContext
  ],
  exports: [
    LedgerStorageService,
    LedgerEntriesStorageService,
    LedgerRevertService,
    LedegrAccountsStorage
  ],
})
export class LedgerModule {}
