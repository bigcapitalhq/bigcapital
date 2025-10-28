
import { Transformer } from '@/modules/Transformer/Transformer';
import { ExpenseCategory } from '../models/ExpenseCategory.model';

export class ExpenseCategoryTransformer extends Transformer {
  /**
   * Include these attributes to expense object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return ['amountFormatted'];
  };

  /**
   * Retrieves the formatted amount.
   * @param {ExpenseCategory} category
   * @returns {string}
   */
  protected amountFormatted(category: ExpenseCategory) {
    return this.formatNumber(category.amount, {
      currencyCode: this.context.organization.baseCurrency,
      money: false,
    });
  }
}
