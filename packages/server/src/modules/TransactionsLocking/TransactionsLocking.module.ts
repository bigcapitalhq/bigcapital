import { Module } from '@nestjs/common';
import { TransactionsLockingService } from './commands/CommandTransactionsLockingService';
import { FinancialTransactionLocking } from './guards/FinancialTransactionLockingGuard';
import { PurchasesTransactionLockingGuard } from './guards/PurchasesTransactionLockingGuard';
import { SalesTransactionLockingGuard } from './guards/SalesTransactionLockingGuard';
import { TransactionsLockingGuard } from './guards/TransactionsLockingGuard';
import { TransactionsLockingRepository } from './TransactionsLockingRepository';
import { FinancialTransactionLockingGuardSubscriber } from './subscribers/FinancialsTransactionLockingGuardSubscriber';
import { PurchasesTransactionLockingGuardSubscriber } from './subscribers/PurchasesTransactionLockingGuardSubscriber';
import { SalesTransactionLockingGuardSubscriber } from './subscribers/SalesTransactionLockingGuardSubscriber';
import { QueryTransactionsLocking } from './queries/QueryTransactionsLocking';
import { TransactionsLockingController } from './TransactionsLocking.controller';
import { SettingsModule } from '../Settings/Settings.module';

@Module({
  imports: [SettingsModule],
  providers: [
    TransactionsLockingService,
    FinancialTransactionLocking,
    PurchasesTransactionLockingGuard,
    SalesTransactionLockingGuard,
    TransactionsLockingGuard,
    TransactionsLockingRepository,
    FinancialTransactionLockingGuardSubscriber,
    PurchasesTransactionLockingGuardSubscriber,
    SalesTransactionLockingGuardSubscriber,
    QueryTransactionsLocking,
  ],
  controllers: [TransactionsLockingController],
})
export class TransactionsLockingModule {}
