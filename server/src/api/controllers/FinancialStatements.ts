import { Router } from 'express';
import { Container, Service } from 'typedi';

import BalanceSheetController from './FinancialStatements/BalanceSheet';
import TrialBalanceSheetController from './FinancialStatements/TrialBalanceSheet';
import GeneralLedgerController from './FinancialStatements/GeneralLedger';
import JournalSheetController from './FinancialStatements/JournalSheet';
import ProfitLossController from './FinancialStatements/ProfitLossSheet';
import ReceivableAgingSummary from './FinancialStatements/ARAgingSummary';
// import PayableAgingSummary from './FinancialStatements/PayableAgingSummary';

@Service()
export default class FinancialStatementsService {
  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.use('/balance_sheet', Container.get(BalanceSheetController).router());
    router.use('/profit_loss_sheet', Container.get(ProfitLossController).router());
    router.use('/general_ledger', Container.get(GeneralLedgerController).router());
    router.use('/trial_balance_sheet', Container.get(TrialBalanceSheetController).router());
    router.use('/journal', Container.get(JournalSheetController).router());
    router.use('/receivable_aging_summary', Container.get(ReceivableAgingSummary).router());
    // router.use('/payable_aging_summary', PayableAgingSummary.router());

    return router;
  }
};
