import { Module } from '@nestjs/common';
import { SalesByItemsApplication } from './SalesByItemsApplication';
import { SalesByItemsTableInjectable } from './SalesByItemsTableInjectable';
import { SalesByItemsPdfInjectable } from './SalesByItemsPdfInjectable';
import { SalesByItemsReportService } from './SalesByItemsService';
import { SalesByItemsExport } from './SalesByItemsExport';
import { FinancialSheetCommonModule } from '../../common/FinancialSheetCommon.module';
import { SalesByItemsMeta } from './SalesByItemsMeta';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { InventoryCostModule } from '@/modules/InventoryCost/InventoryCost.module';
import { SalesByItemsController } from './SalesByItems.controller';

@Module({
  providers: [
    SalesByItemsApplication,
    SalesByItemsTableInjectable,
    SalesByItemsPdfInjectable,
    SalesByItemsReportService,
    SalesByItemsExport,
    SalesByItemsMeta,
    TenancyContext
  ],
  controllers: [SalesByItemsController],
  imports: [
    FinancialSheetCommonModule,
    InventoryCostModule
  ],
})
export class SalesByItemsModule {}
