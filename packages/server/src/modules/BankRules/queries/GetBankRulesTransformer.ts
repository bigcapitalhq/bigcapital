import { Transformer } from '@/modules/Transformer/Transformer';
import { getCashflowTransactionFormattedType } from '../../BankingTransactions/utils';

export class GetBankRulesTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'assignAccountName',
      'assignCategoryFormatted',
      'conditionsFormatted',
    ];
  };

  /**
   * Get the assign account name.
   * @param bankRule
   * @returns {string}
   */
  protected assignAccountName(bankRule: any) {
    return bankRule.assignAccount.name;
  }

  /**
   * Assigned category formatted.
   * @returns {string}
   */
  protected assignCategoryFormatted(bankRule: any) {
    const translationKey = getCashflowTransactionFormattedType(
      bankRule.assignCategory,
    );
    return translationKey
      ? this.context.i18n.t(translationKey)
      : bankRule.assignCategory;
  }

  /**
   * Get the bank rule formatted conditions.
   * @param bankRule
   * @returns {string}
   */
  protected conditionsFormatted(bankRule: any) {
    return bankRule.conditions
      .map((condition) => {
        const field =
          condition.field.charAt(0).toUpperCase() + condition.field.slice(1);

        return `${field} ${condition.comparator} ${condition.value}`;
      })
      .join(bankRule.conditionsType === 'and' ? ' and ' : ' or ');
  }
}
