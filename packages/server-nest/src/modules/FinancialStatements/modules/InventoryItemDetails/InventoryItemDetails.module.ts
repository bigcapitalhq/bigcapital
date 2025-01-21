import { Module } from '@nestjs/common';
import { InventoryItemDetailsController } from './InventoryItemDetails.controller';
import { InventoryDetailsTablePdf } from './InventoryItemDetailsTablePdf';
import { InventoryDetailsService } from './InventoryItemDetails.service';
import { InventoryDetailsTableInjectable } from './InventoryItemDetailsTableInjectable';
import { InventoryItemDetailsExportInjectable } from './InventoryItemDetailsExportInjectable';
import { InventoryItemDetailsApplication } from './InventoryItemDetailsApplication';
import { InventoryItemDetailsRepository } from './InventoryItemDetailsRepository';
import { InventoryDetailsMetaInjectable } from './InventoryItemDetailsMeta';
import { FinancialSheetCommonModule } from '../../common/FinancialSheetCommon.module';
import { InventoryCostModule } from '@/modules/InventoryCost/InventoryCost.module';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';

@Module({
  imports: [FinancialSheetCommonModule, InventoryCostModule],
  providers: [
    InventoryItemDetailsApplication,
    InventoryItemDetailsExportInjectable,
    InventoryDetailsTableInjectable,
    InventoryDetailsService,
    InventoryDetailsTablePdf,
    InventoryItemDetailsRepository,
    InventoryDetailsMetaInjectable,
    TenancyContext,
  ],
  controllers: [InventoryItemDetailsController],
})
export class InventoryItemDetailsModule {}
