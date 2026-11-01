import { Module } from '@nestjs/common';
import { TransactionsByVendorController } from './TransactionsByVendor.controller';
import { TransactionsByVendorsInjectable } from './TransactionsByVendorInjectable';
import { TransactionsByVendorMeta } from './TransactionsByVendorMeta';
import { TransactionsByVendorRepository } from './TransactionsByVendorRepository';
import { TransactionsByVendorTableInjectable } from './TransactionsByVendorTableInjectable';
import { TransactionsByVendorExportInjectable } from './TransactionsByVendorExportInjectable';
import { TransactionsByVendorsPdf } from './TransactionsByVendorPdf';
import { TransactionsByVendorApplication } from './TransactionsByVendorApplication';
import { FinancialSheetCommonModule } from '../../common/FinancialSheetCommon.module';
import { TenancyModule } from '@/modules/Tenancy/Tenancy.module';
import { AccountsModule } from '@/modules/Accounts/Accounts.module';

@Module({
  imports: [TenancyModule, FinancialSheetCommonModule, AccountsModule],
  controllers: [TransactionsByVendorController],
  providers: [
    TransactionsByVendorsInjectable,
    TransactionsByVendorRepository,
    TransactionsByVendorMeta,
    TransactionsByVendorTableInjectable,
    TransactionsByVendorExportInjectable,
    TransactionsByVendorsPdf,
    TransactionsByVendorApplication,
  ],
  exports: [TransactionsByVendorApplication],
})
export class TransactionsByVendorModule {}
