import { Module } from '@nestjs/common';
import { TransactionsByReferenceApplication } from './TransactionsByReferenceApplication';
import { TransactionsByReferenceRepository } from './TransactionsByReferenceRepository';
import { TransactionsByReferenceService } from './TransactionsByReference.service';
import { TransactionsByReferenceController } from './TransactionsByReference.controller';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { FinancialSheetCommonModule } from '../../common/FinancialSheetCommon.module';
import { AccountsModule } from '@/modules/Accounts/Accounts.module';

@Module({
  imports: [FinancialSheetCommonModule, AccountsModule],
  providers: [
    TransactionsByReferenceRepository,
    TransactionsByReferenceApplication,
    TransactionsByReferenceService,
    TenancyContext
  ],
  controllers: [TransactionsByReferenceController],
})
export class TransactionsByReferenceModule { }
