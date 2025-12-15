import { GetMatchedTransactionsByExpenses } from '../queries/GetMatchedTransactionsByExpenses';
import { GetMatchedTransactionsByBills } from '../queries/GetMatchedTransactionsByBills.service';
import { GetMatchedTransactionsByManualJournals } from '../queries/GetMatchedTransactionsByManualJournals.service';
import { MatchTransactionsTypesRegistry } from './MatchTransactionsTypesRegistry';
import { GetMatchedTransactionsByInvoices } from '../queries/GetMatchedTransactionsByInvoices.service';
import { GetMatchedTransactionsByCashflow } from '../queries/GetMatchedTransactionsByCashflow';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MatchTransactionsTypes {
  private static registry: MatchTransactionsTypesRegistry;

  /**
   * Constructor method.
   */
  constructor(
    private readonly matchedTransactionsByInvoices: GetMatchedTransactionsByInvoices,
    private readonly matchedTransactionsByBills: GetMatchedTransactionsByBills,
    private readonly matchedTransactionsByExpenses: GetMatchedTransactionsByExpenses,
    private readonly matchedTransactionsByManualJournals: GetMatchedTransactionsByManualJournals,
    private readonly matchedTransactionsByCashflow: GetMatchedTransactionsByCashflow,
  ) {
    this.boot();
  }

  get registered() {
    return [
      { type: 'SaleInvoice', service: this.matchedTransactionsByInvoices },
      { type: 'Bill', service: this.matchedTransactionsByBills },
      { type: 'Expense', service: this.matchedTransactionsByExpenses },
      {
        type: 'ManualJournal',
        service: this.matchedTransactionsByManualJournals,
      },
      {
        type: 'CashflowTransaction',
        service: this.matchedTransactionsByCashflow,
      },
    ];
  }

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
    if (!MatchTransactionsTypes.registry) {
      const instance = MatchTransactionsTypesRegistry.getInstance();

      this.registered.forEach((registered) => {
        instance.register(registered.type, registered.service);
      });
      MatchTransactionsTypes.registry = instance;
    }
  }
}
