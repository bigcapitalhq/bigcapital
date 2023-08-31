import { Router } from 'express';
import { Container, Service } from 'typedi';

import BalanceSheetController from './FinancialStatements/BalanceSheet';
import TrialBalanceSheetController from './FinancialStatements/TrialBalanceSheet';
import GeneralLedgerController from './FinancialStatements/GeneralLedger';
import JournalSheetController from './FinancialStatements/JournalSheet';
import ProfitLossController from './FinancialStatements/ProfitLossSheet';
import ARAgingSummary from './FinancialStatements/ARAgingSummary';
import APAgingSummary from './FinancialStatements/APAgingSummary';
import PurchasesByItemsController from './FinancialStatements/PurchasesByItem';
import SalesByItemsController from './FinancialStatements/SalesByItems';
import InventoryValuationController from './FinancialStatements/InventoryValuationSheet';
import CustomerBalanceSummaryController from './FinancialStatements/CustomerBalanceSummary';
import VendorBalanceSummaryController from './FinancialStatements/VendorBalanceSummary';
import TransactionsByCustomers from './FinancialStatements/TransactionsByCustomers';
import TransactionsByVendors from './FinancialStatements/TransactionsByVendors';
import CashFlowStatementController from './FinancialStatements/CashFlow/CashFlow';
import InventoryDetailsController from './FinancialStatements/InventoryDetails';
import TransactionsByReferenceController from './FinancialStatements/TransactionsByReference';
import CashflowAccountTransactions from './FinancialStatements/CashflowAccountTransactions';
import ProjectProfitabilityController from './FinancialStatements/ProjectProfitabilitySummary';
import SalesTaxLiabilitySummary from './FinancialStatements/SalesTaxLiabilitySummary';

@Service()
export default class FinancialStatementsService {
  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.use(
      '/balance_sheet',
      Container.get(BalanceSheetController).router()
    );
    router.use(
      '/profit_loss_sheet',
      Container.get(ProfitLossController).router()
    );
    router.use(
      '/general_ledger',
      Container.get(GeneralLedgerController).router()
    );
    router.use(
      '/trial_balance_sheet',
      Container.get(TrialBalanceSheetController).router()
    );
    router.use('/journal', Container.get(JournalSheetController).router());
    router.use(
      '/receivable_aging_summary',
      Container.get(ARAgingSummary).router()
    );
    router.use(
      '/payable_aging_summary',
      Container.get(APAgingSummary).router()
    );
    router.use(
      '/purchases-by-items',
      Container.get(PurchasesByItemsController).router()
    );
    router.use(
      '/sales-by-items',
      Container.get(SalesByItemsController).router()
    );
    router.use(
      '/inventory-valuation',
      Container.get(InventoryValuationController).router()
    );
    router.use(
      '/customer-balance-summary',
      Container.get(CustomerBalanceSummaryController).router()
    );
    router.use(
      '/vendor-balance-summary',
      Container.get(VendorBalanceSummaryController).router()
    );
    router.use(
      '/transactions-by-customers',
      Container.get(TransactionsByCustomers).router()
    );
    router.use(
      '/transactions-by-vendors',
      Container.get(TransactionsByVendors).router()
    );
    router.use(
      '/cash-flow',
      Container.get(CashFlowStatementController).router()
    );
    router.use(
      '/inventory-item-details',
      Container.get(InventoryDetailsController).router()
    );
    router.use(
      '/transactions-by-reference',
      Container.get(TransactionsByReferenceController).router()
    );
    router.use(
      '/cashflow-account-transactions',
      Container.get(CashflowAccountTransactions).router()
    );
    router.use(
      '/project-profitability-summary',
      Container.get(ProjectProfitabilityController).router()
    );
    router.use(
      '/sales-tax-liability-summary',
      Container.get(SalesTaxLiabilitySummary).router()
    );
    return router;
  }
}
