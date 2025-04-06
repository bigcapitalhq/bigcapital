import { Module } from '@nestjs/common';
import { JournalSheetController } from './JournalSheet.controller';
import { JournalSheetApplication } from './JournalSheetApplication';
import { JournalSheetPdfInjectable } from './JournalSheetPdfInjectable';
import { JournalSheetExportInjectable } from './JournalSheetExport';
import { JournalSheetService } from './JournalSheetService';
import { JournalSheetTableInjectable } from './JournalSheetTableInjectable';
import { JournalSheetRepository } from './JournalSheetRepository';
import { JournalSheetMeta } from './JournalSheetMeta';
import { FinancialSheetCommonModule } from '../../common/FinancialSheetCommon.module';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { AccountsModule } from '@/modules/Accounts/Accounts.module';

@Module({
  imports: [FinancialSheetCommonModule, AccountsModule],
  controllers: [JournalSheetController],
  providers: [
    JournalSheetApplication,
    JournalSheetTableInjectable,
    JournalSheetService,
    JournalSheetExportInjectable,
    JournalSheetPdfInjectable,
    JournalSheetRepository,
    JournalSheetMeta,
    TenancyContext,
  ],
})
export class JournalSheetModule {}
