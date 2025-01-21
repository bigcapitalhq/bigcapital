import { Module } from '@nestjs/common';
import { InventoryValuationSheetPdf } from './InventoryValuationSheetPdf';
import { InventoryValuationSheetTableInjectable } from './InventoryValuationSheetTableInjectable';
import { InventoryValuationMetaInjectable } from './InventoryValuationSheetMeta';
import { InventoryValuationController } from './InventoryValuation.controller';
import { InventoryValuationSheetService } from './InventoryValuationSheetService';
import { InventoryValuationSheetApplication } from './InventoryValuationSheetApplication';
import { FinancialSheetCommonModule } from '../../common/FinancialSheetCommon.module';
import { InventoryValuationSheetRepository } from './InventoryValuationSheetRepository';
import { InventoryValuationSheetExportable } from './InventoryValuationSheetExportable';
import { InventoryCostModule } from '@/modules/InventoryCost/InventoryCost.module';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';

@Module({
  imports: [FinancialSheetCommonModule, InventoryCostModule],
  providers: [
    InventoryValuationSheetPdf,
    InventoryValuationSheetTableInjectable,
    InventoryValuationMetaInjectable,
    InventoryValuationSheetService,
    InventoryValuationSheetApplication,
    InventoryValuationSheetRepository,
    InventoryValuationSheetExportable,
    TenancyContext
  ],
  controllers: [InventoryValuationController],
  exports: [InventoryValuationSheetApplication],
})
export class InventoryValuationSheetModule {}
