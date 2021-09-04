import { Service } from 'typedi';
import moment from 'moment';
import { ISaleInvoice } from 'interfaces';
import { Transformer } from 'lib/Transformer/Transformer';
import { formatNumber } from 'utils';

@Service()
export default class JobTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  protected includeAttributes = (): string[] => {
    return ['queued', 'completed', 'failed'];
  };

  /**
   * Detarmines the queued state.
   * @param {IJob} job
   * @returns {String}
   */
  protected queued = (job): boolean => {
    return !!job.nextRunAt && moment().isSameOrAfter(job.nextRunAt, 'seconds');
  };

  /**
   * Detarmines the completed state.
   * @param job
   * @returns
   */
  protected completed = (job): boolean => {
    return !!job.lastFinishedAt;
  };

  /**
   * Detarmines the failed state.
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
