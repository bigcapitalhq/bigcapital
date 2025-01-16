import { Module } from '@nestjs/common';
import { TableSheetPdf } from './TableSheetPdf';
import { PurchasesByItemsModule } from './modules/PurchasesByItems/PurchasesByItems.module';

@Module({
  providers: [TableSheetPdf],
  imports: [PurchasesByItemsModule],
})
export class FinancialStatementsModule {}
