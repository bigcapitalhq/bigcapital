import { Module } from '@nestjs/common';
import { PurchasesByItemsTableInjectable } from './PurchasesByItemsTableInjectable';
import { PurchasesByItemsService } from './PurchasesByItems.service';
import { PurchasesByItemsPdf } from './PurchasesByItemsPdf';
import { PurchasesByItemsExport } from './PurchasesByItemsExport';
import { PurchasesByItemsApplication } from './PurchasesByItemsApplication';
import { PurchasesByItemReportController } from './PurchasesByItems.controller';
import { PurchasesByItemsMeta } from './PurchasesByItemsMeta';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { InventoryCostModule } from '@/modules/InventoryCost/InventoryCost.module';
import { FinancialSheetCommonModule } from '../../common/FinancialSheetCommon.module';

@Module({
  imports: [InventoryCostModule, FinancialSheetCommonModule],
  providers: [
    PurchasesByItemsTableInjectable,
    PurchasesByItemsService,
    PurchasesByItemsExport,
    PurchasesByItemsPdf,
    PurchasesByItemsMeta,
    PurchasesByItemsApplication,
    TenancyContext,
  ],
  exports: [PurchasesByItemsApplication],
  controllers: [PurchasesByItemReportController],
})
export class PurchasesByItemsModule {}
