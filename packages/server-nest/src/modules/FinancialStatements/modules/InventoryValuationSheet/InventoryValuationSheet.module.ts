import { Module } from '@nestjs/common';
import { InventoryValuationSheetPdf } from './InventoryValuationSheetPdf';
import { InventoryValuationSheetTableInjectable } from './InventoryValuationSheetTableInjectable';
import { InventoryValuationMetaInjectable } from './InventoryValuationSheetMeta';
import { InventoryValuationController } from './InventoryValuation.controller';
import { InventoryValuationSheetService } from './InventoryValuationSheetService';
import { InventoryValuationSheetApplication } from './InventoryValuationSheetApplication';

@Module({
  providers: [
    InventoryValuationSheetPdf,
    InventoryValuationSheetTableInjectable,
    InventoryValuationMetaInjectable,
    InventoryValuationSheetService,
    InventoryValuationSheetApplication,
  ],
  controllers: [InventoryValuationController],
  exports: [InventoryValuationSheetApplication],
})
export class InventoryValuationSheetModule {}
