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
import { TenancyModule } from '@/modules/Tenancy/Tenancy.module';

@Module({
  imports: [TenancyModule, FinancialSheetCommonModule],
  controllers: [CustomerBalanceSummaryController],
  providers: [
    CustomerBalanceSummaryApplication,
    CustomerBalanceSummaryExportInjectable,
    CustomerBalanceSummaryMeta,
    CustomerBalanceSummaryPdf,
    CustomerBalanceSummaryService,
    CustomerBalanceSummaryTableInjectable,
    CustomerBalanceSummaryRepository,
  ],
})
export class CustomerBalanceSummaryModule {}
