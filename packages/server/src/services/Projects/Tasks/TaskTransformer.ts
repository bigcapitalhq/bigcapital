import { Transformer } from '@/lib/Transformer/Transformer';
import { formatMinutes } from 'utils/formatMinutes';

export class TaskTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'estimateHoursFormatted',
      'actualHoursFormatted',
      'invoicedHoursFormatted',
      'billableHoursFormatted',
    ];
  };

  /**
   * Retrieves the formatted estimate hours.
   * @returns {string}
   */
  public estimateHoursFormatted = (task): string => {
    return formatMinutes(task.estimateHours);
  };

  /**
   * Retrieves the formatted actual hours.
   * @returns {string}
   */
  public actualHoursFormatted = (task): string => {
    return formatMinutes(task.actualHours);
  };

  /**
   * Retrieves the formatted billable hours.
   * @returns {string}
   */
  public billableHoursFormatted = (task): string => {
    return formatMinutes(task.billableHours);
  };

  /**
   * Retrieves the formatted invoiced hours.
   * @returns {string}
   */
  public invoicedHoursFormatted = (task): string => {
    return formatMinutes(task.invoicedHours);
  };
}
