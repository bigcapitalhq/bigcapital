import { Module } from '@nestjs/common';
import { GeneralLedgerRepository } from './GeneralLedgerRepository';
import { GeneralLedgerApplication } from './GeneralLedgerApplication';
import { GeneralLedgerPdf } from './GeneralLedgerPdf';
import { GeneralLedgerExportInjectable } from './GeneralLedgerExport';
import { GeneralLedgerTableInjectable } from './GeneralLedgerTableInjectable';
import { GeneralLedgerService } from './GeneralLedgerService';
import { GeneralLedgerController } from './GeneralLedger.controller';
import { FinancialSheetCommonModule } from '../../common/FinancialSheetCommon.module';
import { GeneralLedgerMeta } from './GeneralLedgerMeta';
import { AccountsModule } from '@/modules/Accounts/Accounts.module';
import { TenancyModule } from '@/modules/Tenancy/Tenancy.module';

@Module({
  imports: [TenancyModule, FinancialSheetCommonModule, AccountsModule],
  providers: [
    GeneralLedgerRepository,
    GeneralLedgerApplication,
    GeneralLedgerPdf,
    GeneralLedgerExportInjectable,
    GeneralLedgerTableInjectable,
    GeneralLedgerService,
    GeneralLedgerMeta,
  ],
  controllers: [GeneralLedgerController],
})
export class GeneralLedgerModule {}
