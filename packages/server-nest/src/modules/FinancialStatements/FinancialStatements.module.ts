import { Module } from '@nestjs/common';
import { PurchasesByItemsModule } from './modules/PurchasesByItems/PurchasesByItems.module';
import { CustomerBalanceSummaryModule } from './modules/CustomerBalanceSummary/CustomerBalanceSummary.module';
import { SalesByItemsModule } from './modules/SalesByItems/SalesByItems.module';
import { GeneralLedgerModule } from './modules/GeneralLedger/GeneralLedger.module';
import { TransactionsByCustomerModule } from './modules/TransactionsByCustomer/TransactionsByCustomer.module';
import { TrialBalanceSheetModule } from './modules/TrialBalanceSheet/TrialBalanceSheet.module';
import { TransactionsByReferenceModule } from './modules/TransactionsByReference/TransactionByReference.module';
import { TransactionsByVendorModule } from './modules/TransactionsByVendor/TransactionsByVendor.module';
// 
@Module({
  providers: [],
  imports: [
    PurchasesByItemsModule,
    CustomerBalanceSummaryModule,
    SalesByItemsModule,
    GeneralLedgerModule,
    TrialBalanceSheetModule,
    TransactionsByCustomerModule,
    TransactionsByVendorModule,
    // TransactionsByReferenceModule,
    // TransactionsByVendorModule,
    // TransactionsByContactModule,
  ],
})
export class FinancialStatementsModule {}

