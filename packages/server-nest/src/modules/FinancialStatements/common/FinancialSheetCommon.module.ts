import { Module } from '@nestjs/common';
import { FinancialSheetMeta } from './FinancialSheetMeta';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { TableSheetPdf } from './TableSheetPdf';
import { TemplateInjectableModule } from '@/modules/TemplateInjectable/TemplateInjectable.module';
import { ChromiumlyTenancyModule } from '@/modules/ChromiumlyTenancy/ChromiumlyTenancy.module';

@Module({
  imports: [TemplateInjectableModule, ChromiumlyTenancyModule],
  providers: [
    FinancialSheetMeta,
    TenancyContext,
    TableSheetPdf,
  ],
  exports: [FinancialSheetMeta, TableSheetPdf],
})
export class FinancialSheetCommonModule {}
