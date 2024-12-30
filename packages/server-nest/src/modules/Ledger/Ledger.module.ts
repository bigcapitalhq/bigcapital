import { Module } from '@nestjs/common';
import { LedgerStorageService } from './LedgerStorage.service';
import { LedgerEntriesStorageService } from './LedgerEntriesStorage.service';
import { LedgerRevertService } from './LedgerStorageRevert.service';
import { LedgerContactsBalanceStorage } from './LedgerContactStorage.service';

@Module({
  providers: [
    LedgerStorageService,
    LedgerEntriesStorageService,
    LedgerRevertService,
    LedgerContactsBalanceStorage,
  ],
  exports: [
    LedgerStorageService,
    LedgerEntriesStorageService,
    LedgerRevertService,
  ],
})
export class LedgerModule {}
