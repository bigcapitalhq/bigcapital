import { Module } from '@nestjs/common';
import { CustomerBalanceSummaryApplication } from './CustomerBalanceSummaryApplication';
import { CustomerBalanceSummaryExportInjectable } from './CustomerBalanceSummaryExportInjectable';
import { CustomerBalanceSummaryMeta } from './CustomerBalanceSummaryMeta';
import { CustomerBalanceSummaryPdf } from './CustomerBalanceSummaryPdf';
import { CustomerBalanceSummaryService } from './CustomerBalanceSummaryService';
import { CustomerBalanceSummaryTableInjectable } from './CustomerBalanceSummaryTableInjectable';
import { CustomerBalanceSummaryController } from './CustomerBalanceSummary.controller';
import { FinancialSheetCommonModule } from '../../common/FinancialSheetCommon.module';
import { CustomerBalanceSummaryRepository } from './CustomerBalanceSummaryRepository';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';

@Module({
  imports: [
    FinancialSheetCommonModule,
  ],
  controllers: [CustomerBalanceSummaryController],
  providers: [
    CustomerBalanceSummaryApplication,
    CustomerBalanceSummaryExportInjectable,
    CustomerBalanceSummaryMeta,
    CustomerBalanceSummaryPdf,
    CustomerBalanceSummaryService,
    CustomerBalanceSummaryTableInjectable,
    CustomerBalanceSummaryRepository,
    TenancyContext
  ],
})
export class CustomerBalanceSummaryModule {}
