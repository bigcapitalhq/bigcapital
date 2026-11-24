import { sumBy } from 'lodash';
import { Transformer } from '@/modules/Transformer/Transformer';
import { Budget } from '../models/Budget';
import { BudgetEntryTransformer } from './BudgetEntryTransformer';

export class BudgetTransformer extends Transformer {
  /**
   * Included attributes.
   * @returns {string[]}
   */
  public includeAttributes = (): string[] => {
    return [
      'formattedFromDate',
      'formattedToDate',
      'formattedCreatedAt',
      'totalBudgetAmount',
      'formattedTotalBudgetAmount',
      'entries',
    ];
  };

  /**
   * Retrieves the formatted from date.
   * @param {Budget} budget
   * @returns {string}
   */
  protected formattedFromDate = (budget: Budget): string => {
    return this.formatDate(budget.fromDate);
  };

  /**
   * Retrieves the formatted to date.
   * @param {Budget} budget
   * @returns {string}
   */
  protected formattedToDate = (budget: Budget): string => {
    return this.formatDate(budget.toDate);
  };

  /**
   * Retrieves the formatted created at date.
   * @param {Budget} budget
   * @returns {string}
   */
  protected formattedCreatedAt = (budget: Budget): string => {
    return this.formatDate(budget.createdAt);
  };

  /**
   * Retrieves the total budgeted amount of the entries.
   * @param {Budget} budget
   * @returns {number}
   */
  protected totalBudgetAmount = (budget: Budget): number => {
    return sumBy(budget.entries, (entry) => Number(entry.amount));
  };

  /**
   * Retrieves the formatted total budgeted amount.
   * @param {Budget} budget
   * @returns {string}
   */
  protected formattedTotalBudgetAmount = (budget: Budget): string => {
    return this.formatMoney(
      sumBy(budget.entries, (entry) => Number(entry.amount)),
    );
  };

  /**
   * Retrieves the budget entries.
   * @param {Budget} budget
   * @returns
   */
  protected entries = (budget: Budget) => {
    return this.item(budget.entries, new BudgetEntryTransformer());
  };
}
