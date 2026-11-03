import { Module } from '@nestjs/common';
import { FinancialSheetCommonModule } from '../../common/FinancialSheetCommon.module';
import { InventoryCostModule } from '@/modules/InventoryCost/InventoryCost.module';
import { TenancyModule } from '@/modules/Tenancy/Tenancy.module';
import { InventoryTurnoverByAmountController } from './InventoryTurnoverByAmount.controller';
import { InventoryTurnoverByAmountApplication } from './InventoryTurnoverByAmountApplication';
import { InventoryTurnoverByAmountService } from './InventoryTurnoverByAmount.service';
import { InventoryTurnoverByAmountRepository } from './InventoryTurnoverByAmountRepository';
import { InventoryTurnoverByAmountMeta } from './InventoryTurnoverByAmountMeta';
import { InventoryTurnoverByAmountTableInjectable } from './InventoryTurnoverByAmountTableInjectable';
import { InventoryTurnoverByAmountExportable } from './InventoryTurnoverByAmountExportable';
import { InventoryTurnoverByAmountPdf } from './InventoryTurnoverByAmountPdf';

@Module({
  imports: [TenancyModule, FinancialSheetCommonModule, InventoryCostModule],
  providers: [
    InventoryTurnoverByAmountApplication,
    InventoryTurnoverByAmountService,
    InventoryTurnoverByAmountRepository,
    InventoryTurnoverByAmountMeta,
    InventoryTurnoverByAmountTableInjectable,
    InventoryTurnoverByAmountExportable,
    InventoryTurnoverByAmountPdf,
  ],
  controllers: [InventoryTurnoverByAmountController],
  exports: [InventoryTurnoverByAmountApplication],
})
export class InventoryTurnoverByAmountModule {}
