import { Module } from '@nestjs/common';
import { SalesByItemsApplication } from './SalesByItemsApplication';
import { SalesByItemsTableInjectable } from './SalesByItemsTableInjectable';
import { SalesByItemsPdfInjectable } from './SalesByItemsPdfInjectable';
import { SalesByItemsReportService } from './SalesByItemsService';
import { SalesByItemsExport } from './SalesByItemsExport';
import { FinancialSheetCommonModule } from '../../common/FinancialSheetCommon.module';
import { SalesByItemsMeta } from './SalesByItemsMeta';
import { TenancyModule } from '@/modules/Tenancy/Tenancy.module';
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
  ],
  controllers: [SalesByItemsController],
  imports: [TenancyModule, FinancialSheetCommonModule, InventoryCostModule],
})
export class SalesByItemsModule {}
