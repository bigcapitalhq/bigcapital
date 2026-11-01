import { Module } from '@nestjs/common';
import { TransactionsByCustomersExportInjectable } from './TransactionsByCustomersExportInjectable';
import { TransactionsByCustomersPdf } from './TransactionsByCustomersPdf';
import { TransactionsByCustomersRepository } from './TransactionsByCustomersRepository';
import { TransactionsByCustomersSheet } from './TransactionsByCustomersService';
import { TransactionsByCustomersTableInjectable } from './TransactionsByCustomersTableInjectable';
import { TransactionsByCustomersMeta } from './TransactionsByCustomersMeta';
import { TenancyModule } from '@/modules/Tenancy/Tenancy.module';
import { FinancialSheetCommonModule } from '../../common/FinancialSheetCommon.module';
import { AccountsModule } from '@/modules/Accounts/Accounts.module';
import { TransactionsByCustomerController } from './TransactionsByCustomer.controller';
import { TransactionsByCustomerApplication } from './TransactionsByCustomersApplication';

@Module({
  imports: [TenancyModule, FinancialSheetCommonModule, AccountsModule],
  providers: [
    TransactionsByCustomerApplication,
    TransactionsByCustomersRepository,
    TransactionsByCustomersTableInjectable,
    TransactionsByCustomersExportInjectable,
    TransactionsByCustomersSheet,
    TransactionsByCustomersPdf,
    TransactionsByCustomersMeta,
  ],
  controllers: [TransactionsByCustomerController],
})
export class TransactionsByCustomerModule {}
