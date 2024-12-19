import { Transformer } from '@/modules/Transformer/Transformer';
import { ExpenseCategoryTransformer } from './ExpenseCategory.transformer';
// import { AttachmentTransformer } from '@/services/Attachments/AttachmentTransformer';
import { Expense } from '../models/Expense.model';

export class ExpenseTransfromer extends Transformer {
  /**
   * Include these attributes to expense object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'formattedAmount',
      'formattedLandedCostAmount',
      'formattedAllocatedCostAmount',
      'formattedDate',
      'formattedCreatedAt',
      'formattedPublishedAt',
      'categories',
      'attachments',
    ];
  };

  /**
   * Retrieve formatted expense amount.
   * @param {IExpense} expense
   * @returns {string}
   */
  protected formattedAmount = (expense: Expense): string => {
    return this.formatNumber(expense.totalAmount, {
      currencyCode: expense.currencyCode,
    });
  };

  /**
   * Retrieve formatted expense landed cost amount.
   * @param {IExpense} expense
   * @returns {string}
   */
  protected formattedLandedCostAmount = (expense: Expense): string => {
    return this.formatNumber(expense.landedCostAmount, {
      currencyCode: expense.currencyCode,
    });
  };

  /**
   * Retrieve formatted allocated cost amount.
   * @param {IExpense} expense
   * @returns {string}
   */
  protected formattedAllocatedCostAmount = (expense: Expense): string => {
    return this.formatNumber(expense.allocatedCostAmount, {
      currencyCode: expense.currencyCode,
    });
  };

  /**
   * Retriecve fromatted date.
   * @param {IExpense} expense
   * @returns {string}
   */
  protected formattedDate = (expense: Expense): string => {
    return this.formatDate(expense.paymentDate);
  };

  /**
   * Retrieve formatted created at date.
   * @param {IExpense} expense 
   * @returns {string}
   */
  protected formattedCreatedAt = (expense: Expense): string => {
    return this.formatDate(expense.createdAt);
  }

  /**
   * Retrieves the transformed expense categories.
   * @param {IExpense} expense
   * @returns {}
   */
  protected categories = (expense: Expense) => {
    // return this.item(expense.categories, new ExpenseCategoryTransformer(), {
    //   currencyCode: expense.currencyCode,
    // });
  };

  /**
   * Retrieves the sale invoice attachments.
   * @param {ISaleInvoice} invoice
   * @returns
   */
  protected attachments = (expense: Expense) => {
    // return this.item(expense.attachments, new AttachmentTransformer());
  };

  /**
   * Retrieve formatted published at date.
   * @param {IExpense} expense 
   * @returns {string}
   */
  protected formattedPublishedAt = (expense: Expense): string => {
    return this.formatDate(expense.publishedAt);
  }
}
