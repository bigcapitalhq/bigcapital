import { Module } from '@nestjs/common';
import { PurchasesByItemsTableInjectable } from './PurchasesByItemsTableInjectable';
import { PurchasesByItemsService } from './PurchasesByItemsService';
import { PurchasesByItemsPdf } from './PurchasesByItemsPdf';
import { PurchasesByItemsExport } from './PurchasesByItemsExport';
import { PurchasesByItemsApplication } from './PurchasesByItemsApplication';
import { PurchasesByItemReportController } from './PurchasesByItems.controller';

@Module({
  providers: [
    PurchasesByItemsTableInjectable,
    PurchasesByItemsService,
    PurchasesByItemsExport,
    PurchasesByItemsPdf,
    PurchasesByItemsApplication,
  ],
  exports: [PurchasesByItemsApplication],
  controllers: [PurchasesByItemReportController],
})
export class PurchasesByItemsModule {}
