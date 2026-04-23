import { Transformer } from '@/modules/Transformer/Transformer';
import { ExpensePaymentSplit } from '../models/ExpensePaymentSplit.model';

export class ExpensePaymentSplitTransformer extends Transformer {
  public includeAttributes = (): string[] => {
    return ['amountFormatted'];
  };

  protected amountFormatted(split: ExpensePaymentSplit) {
    return this.formatNumber(split.amount, {
      currencyCode: this.context.organization.baseCurrency,
      money: false,
    });
  }
}
