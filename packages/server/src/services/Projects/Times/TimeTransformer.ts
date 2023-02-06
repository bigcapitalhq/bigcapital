import { Transformer } from '@/lib/Transformer/Transformer';
import Time from 'models/Time';
import { formatMinutes } from 'utils/formatMinutes';

export class TimeTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return ['projectName', 'taskName', 'customerName', 'durationFormatted'];
  };

  /**
   * Exclude attributes.
   * @returns {string[]}
   */
  public excludeAttributes = (): string[] => {
    return ['project', 'task'];
  };

  /**
   * Retrieves the project name that associated to the time entry.
   * @param {Time} time
   * @returns {string}
   */
  public projectName = (time: Time) => {
    return time.project.name;
  };

  /**
   * Retrieves the task name that associated to the time entry.
   * @param {Time} time
   * @returns {string}
   */
  public taskName = (time: Time) => {
    return time.task.name;
  };

  /**
   * Retrieves the customer name that associated to the task of the time entry.
   * @param {Time} time
   * @returns {string}
   */
  public customerName = (time: Time) => {
    return time?.project?.contact?.displayName;
  };

  /**
   * Retrieves the formatted duration.
   * @param {Time} time 
   * @returns {string}
   */
  public durationFormatted = (time: Time) => {
    return formatMinutes(time.duration);
  }
}
