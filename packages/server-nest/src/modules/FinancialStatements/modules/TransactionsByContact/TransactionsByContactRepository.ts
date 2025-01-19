import { Ledger } from '@/modules/Ledger/Ledger';
import { ILedgerEntry } from '@/modules/Ledger/types/Ledger.types';

export class TransactionsByContactRepository {
  /**
   * Base currency.
   * @param {string} baseCurrency
   */
  public baseCurrency: string;

  /**
   * Report data.
   */
  public accountsGraph: any;

  /**
   * Report data.
   * @param {Ledger} ledger
   */
  public ledger: Ledger;

  /**
   * Opening balance entries.
   * @param {ILedgerEntry[]} openingBalanceEntries
   */
  public openingBalanceEntries: ILedgerEntry[];
}
