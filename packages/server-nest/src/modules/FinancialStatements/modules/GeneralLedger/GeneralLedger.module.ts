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
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';

@Module({
  imports: [
    FinancialSheetCommonModule,
    AccountsModule
  ],
  providers: [
    GeneralLedgerRepository,
    GeneralLedgerApplication,
    GeneralLedgerPdf,
    GeneralLedgerExportInjectable,
    GeneralLedgerTableInjectable,
    GeneralLedgerService,
    GeneralLedgerMeta,
    TenancyContext
  ],
  controllers: [GeneralLedgerController],
})
export class GeneralLedgerModule {}
