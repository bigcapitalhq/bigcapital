import { IProjectTask } from '@/interfaces';
import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from 'utils';

export class ProjectBillableTaskTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'billableType',
      'billableId',
      'billableAmount',
      'billableAmountFormatted',
      'billableHours',
      'billableCurrency',
      'billableTransactionNo',
      'billableDate',
      'billableDateFormatted',
    ];
  };

  /**
   * Exclude attributes.
   * @returns {string[]}
   */
  public excludeAttributes = (): string[] => {
    return ['*'];
  };

  /**
   * Billable type.
   * @returns {string}
   */
  public billableType = () => {
    return 'Task';
  };

  /**
   * Billable id.
   * @param {IProjectTask} task
   * @returns {string}
   */
  public billableId = (task: IProjectTask) => {
    return task.id;
  };

  /**
   * Billable amount.
   * @param {IProjectTask} task
   * @returns {number}
   */
  public billableAmount = (task: IProjectTask) => {
    return task.billableAmount;
  };

  /**
   * Billable amount formatted.
   * @returns {string}
   */
  public billableAmountFormatted = (task: IProjectTask) => {
    return formatNumber(task.billableAmount, {
      currencyCode: this.context.baseCurrency,
    });
  };

  /**
   * Billable hours of the task.
   * @param {IProjectTask} task
   * @returns {number}
   */
  public billableHours = (task: IProjectTask) => {
    return task.billableHours;
  };

  /**
   * Retrieves the currency of billable entry.
   * @returns {string}
   */
  public billableCurrency = () => {
    return this.context.baseCurrency;
  };

  /**
   * Billable transaction number.
   * @returns {string}
   */
  public billableTransactionNo = () => {
    return '';
  };

  /**
   * Billable date.
   * @returns {Date}
   */
  public billableDate = (task: IProjectTask) => {
    return task.createdAt;
  };

  /**
   * Billable date formatted.
   * @returns {string}
   */
  public billableDateFormatted = (task: IProjectTask) => {
    return this.formatDate(task.createdAt);
  };
}
