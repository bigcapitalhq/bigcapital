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
   * Consttuctor method.
   */
  constructor() {
    this.boot();
  }

  get registered() {
    return [
      { type: 'SaleInvoice', service: GetMatchedTransactionsByInvoices },
      { type: 'Bill', service: GetMatchedTransactionsByBills },
      { type: 'Expense', service: GetMatchedTransactionsByExpenses },
      {
        type: 'ManualJournal',
        service: GetMatchedTransactionsByManualJournals,
      },
      {
        type: 'CashflowTransaction',
        service: GetMatchedTransactionsByCashflow,
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
    if (!MatchTransactionsTypes.registry) {
      const instance = MatchTransactionsTypesRegistry.getInstance();

      this.registered.forEach((registered) => {
        const serviceInstanace = Container.get(registered.service);
        instance.register(registered.type, serviceInstanace);
      });
      MatchTransactionsTypes.registry = instance;
    }
  }
}
