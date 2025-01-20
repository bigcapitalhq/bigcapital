import { Module } from '@nestjs/common';
import { InventoryItemDetailsController } from './InventoryItemDetails.controller';
import { InventoryDetailsTablePdf } from './InventoryItemDetailsTablePdf';
import { InventoryDetailsService } from './InventoryItemDetailsService';
import { InventoryDetailsTableInjectable } from './InventoryItemDetailsTableInjectable';
import { InventoryItemDetailsExportInjectable } from './InventoryItemDetailsExportInjectable';
import { InventoryItemDetailsApplication } from './InventoryItemDetailsApplication';

@Module({
  providers: [
    InventoryItemDetailsApplication,
    InventoryItemDetailsExportInjectable,
    InventoryDetailsTableInjectable,
    InventoryDetailsService,
    InventoryDetailsTablePdf,
  ],
  controllers: [InventoryItemDetailsController],
})
export class InventoryItemDetailsModule {}
