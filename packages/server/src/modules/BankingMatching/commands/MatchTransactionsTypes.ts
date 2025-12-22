import { GetMatchedTransactionsByExpenses } from '../queries/GetMatchedTransactionsByExpenses';
import { GetMatchedTransactionsByBills } from '../queries/GetMatchedTransactionsByBills.service';
import { GetMatchedTransactionsByManualJournals } from '../queries/GetMatchedTransactionsByManualJournals.service';
import { MatchTransactionsTypesRegistry } from './MatchTransactionsTypesRegistry';
import { GetMatchedTransactionsByInvoices } from '../queries/GetMatchedTransactionsByInvoices.service';
import { GetMatchedTransactionCashflowTransformer } from '../queries/GetMatchedTransactionCashflowTransformer';
import { GetMatchedTransactionsByCashflow } from '../queries/GetMatchedTransactionsByCashflow';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MatchTransactionsTypes {
  private static registry: MatchTransactionsTypesRegistry;

  /**
   * Constructor method.
   */
  constructor(
    private readonly getMatchedInvoicesService: GetMatchedTransactionsByInvoices,
    private readonly getMatchedBillsService: GetMatchedTransactionsByBills,
    private readonly getMatchedExpensesService: GetMatchedTransactionsByExpenses,
    private readonly getMatchedManualJournalsService: GetMatchedTransactionsByManualJournals,
    private readonly getMatchedCashflowService: GetMatchedTransactionsByCashflow,
  ) {
    this.boot();
  }

  get registered() {
    return [
      { type: 'SaleInvoice', service: this.getMatchedInvoicesService },
      { type: 'Bill', service: this.getMatchedBillsService },
      { type: 'Expense', service: this.getMatchedExpensesService },
      {
        type: 'ManualJournal',
        service: this.getMatchedManualJournalsService,
      },
      {
        type: 'CashflowTransaction',
        service: this.getMatchedCashflowService,
      },
    ];
  }

  /**
   * Importable instances.
   */
  private types = [];

  /**
   *
   */
  public get registry() {
    return MatchTransactionsTypes.registry;
  }

  /**
   * Boots all the registered importables.
   */
  public boot() {
    const instance = MatchTransactionsTypesRegistry.getInstance();

    // Always register services to ensure they're available
    this.registered.forEach((registered) => {
      instance.register(registered.type, registered.service);
    });

    MatchTransactionsTypes.registry = instance;
  }
}
