import express from 'express';

import BalanceSheetController from './FinancialStatements/BalanceSheet';
import TrialBalanceSheetController from './FinancialStatements/TrialBalanceSheet';
import GeneralLedgerController from './FinancialStatements/generalLedger';
import JournalSheetController from './FinancialStatements/JournalSheet';
import ProfitLossController from './FinancialStatements/ProfitLossSheet';
import ReceivableAgingSummary from './FinancialStatements/ReceivableAgingSummary';
import PayableAgingSummary from './FinancialStatements/PayableAgingSummary';

export default {
  /**
   * Router constructor.
   */
  router() {
    const router = express.Router();

    router.use('/balance_sheet', BalanceSheetController.router());
    router.use('/profit_loss_sheet', ProfitLossController.router());
    router.use('/general_ledger', GeneralLedgerController.router());
    router.use('/trial_balance_sheet', TrialBalanceSheetController.router());
    router.use('/journal', JournalSheetController.router());
    router.use('/receivable_aging_summary', ReceivableAgingSummary.router());
    router.use('/payable_aging_summary', PayableAgingSummary.router());

    return router;
  },
};
