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
import { TenancyModule } from '@/modules/Tenancy/Tenancy.module';
import { AccountsModule } from '@/modules/Accounts/Accounts.module';

@Module({
  imports: [TenancyModule, FinancialSheetCommonModule, AccountsModule],
  controllers: [JournalSheetController],
  providers: [
    JournalSheetApplication,
    JournalSheetTableInjectable,
    JournalSheetService,
    JournalSheetExportInjectable,
    JournalSheetPdfInjectable,
    JournalSheetRepository,
    JournalSheetMeta,
  ],
})
export class JournalSheetModule {}
