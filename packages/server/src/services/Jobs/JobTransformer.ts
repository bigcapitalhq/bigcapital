import { Service } from 'typedi';
import moment from 'moment';
import { Transformer } from '@/lib/Transformer/Transformer';

@Service()
export class JobTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return ['queued', 'completed', 'failed'];
  };

  /**
   * Determines the queued state.
   * @param {IJob} job
   * @returns {String}
   */
  protected queued = (job): boolean => {
    return !!job.nextRunAt && moment().isSameOrAfter(job.nextRunAt, 'seconds');
  };

  /**
   * Determines the completed state.
   * @param job
   * @returns
   */
  protected completed = (job): boolean => {
    return !!job.lastFinishedAt;
  };

  /**
   * Determines the failed state.
   * @param job
   * @returns
   */
  protected failed = (job): boolean => {
    return (
      job.lastFinishedAt &&
      job.failedAt &&
      moment(job.failedAt).isSame(job.lastFinishedAt)
    );
  };
}
