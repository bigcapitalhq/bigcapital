import { Transformer } from '@/modules/Transformer/Transformer';

/**
 * Transforms an expense candidate for the bank-matching UI. Input can be
 * either an `ExpensePaymentSplit` (loaded with `.expense`) or a bare
 * `Expense` (legacy single-lookup path). Split-input rows carry the split
 * id as `referenceSubId` and use the split's amount; expense-input rows
 * leave `referenceSubId` null.
 */
export class GetMatchedTransactionExpensesTransformer extends Transformer {
  public includeAttributes = (): string[] => {
    return [
      'referenceNo',
      'amount',
      'amountFormatted',
      'transactionNo',
      'date',
      'dateFormatted',
      'transactionId',
      'transactionType',
      'transsactionTypeFormatted',
      'transactionNormal',
      'referenceType',
      'referenceId',
      'referenceSubId',
    ];
  };

  public excludeAttributes = (): string[] => {
    return ['*'];
  };

  /**
   * Returns the underlying Expense model whether we were handed a split
   * (with `.expense` eager-loaded) or the expense itself.
   */
  private expenseOf(input: any) {
    return input?.expense ?? input;
  }

  /**
   * True when the input is an ExpensePaymentSplit.
   */
  private isSplit(input: any): boolean {
    return !!input?.expense && input?.paymentAccountId !== undefined;
  }

  protected referenceNo(input: any) {
    return this.expenseOf(input).referenceNo;
  }

  protected amount(input: any) {
    return this.isSplit(input)
      ? input.amount
      : this.expenseOf(input).totalAmount;
  }

  protected amountFormatted(input: any) {
    const expense = this.expenseOf(input);
    const value = this.isSplit(input) ? input.amount : expense.totalAmount;
    return this.formatNumber(value, {
      currencyCode: expense.currencyCode,
      money: true,
    });
  }

  protected date(input: any) {
    return this.expenseOf(input).paymentDate;
  }

  protected dateFormatted(input: any) {
    return this.formatDate(this.expenseOf(input).paymentDate);
  }

  protected transactionId(input: any) {
    return this.expenseOf(input).id;
  }

  protected transactionNo(input: any) {
    return this.expenseOf(input).expenseNo;
  }

  protected transactionType() {
    return 'Expense';
  }

  protected transsactionTypeFormatted() {
    return 'Expense';
  }

  protected transactionNormal() {
    return 'credit';
  }

  protected referenceType() {
    return 'Expense';
  }

  protected referenceId(input: any) {
    return this.expenseOf(input).id;
  }

  protected referenceSubId(input: any) {
    return this.isSplit(input) ? input.id : null;
  }
}
