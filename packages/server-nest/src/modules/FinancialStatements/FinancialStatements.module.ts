import { Module } from '@nestjs/common';
import { PurchasesByItemsModule } from './modules/PurchasesByItems/PurchasesByItems.module';
import { CustomerBalanceSummaryModule } from './modules/CustomerBalanceSummary/CustomerBalanceSummary.module';
import { SalesByItemsModule } from './modules/SalesByItems/SalesByItems.module';
import { GeneralLedgerModule } from './modules/GeneralLedger/GeneralLedger.module';
// 
@Module({
  providers: [],
  imports: [
    PurchasesByItemsModule,
    CustomerBalanceSummaryModule,
    SalesByItemsModule,
    GeneralLedgerModule
  ],
})
export class FinancialStatementsModule {}
