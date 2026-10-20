import { Transformer } from '@/modules/Transformer/Transformer';
import { BudgetEntry } from '../models/BudgetEntry';

export class BudgetEntryTransformer extends Transformer {
  /**
   * Included attributes.
   * @returns {string[]}
   */
  public includeAttributes = (): string[] => {
    return ['accountName', 'accountCode', 'formattedDate', 'formattedAmount'];
  };

  /**
   * Retrieves the entry account name.
   * @param {BudgetEntry} entry
   * @returns {string}
   */
  protected accountName = (entry: BudgetEntry): string => {
    return entry.account?.name;
  };

  /**
   * Retrieves the entry account code.
   * @param {BudgetEntry} entry
   * @returns {string}
   */
  protected accountCode = (entry: BudgetEntry): string => {
    return entry.account?.code;
  };

  /**
   * Retrieves the formatted entry date.
   * @param {BudgetEntry} entry
   * @returns {string}
   */
  protected formattedDate = (entry: BudgetEntry): string => {
    return this.formatDate(entry.date);
  };

  /**
   * Retrieves the formatted entry amount.
   * @param {BudgetEntry} entry
   * @returns {string}
   */
  protected formattedAmount = (entry: BudgetEntry): string => {
    return this.formatMoney(entry.amount);
  };
}
