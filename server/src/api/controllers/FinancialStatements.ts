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
    return router;
  }
}
