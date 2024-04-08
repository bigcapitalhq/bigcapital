import { IJobMeta } from '@/interfaces';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { first, pick } from 'lodash';
import { Types } from 'mongoose';
const { ObjectId } = Types;
import { Inject, Service } from 'typedi';
import { JobTransformer } from './JobTransformer';

@Service()
export default class JobsService {
  @Inject('agenda')
  agenda: any;

  @Inject()
  transformer: TransformerInjectable;

  /**
   * Retrieve job details of the given job id.
   * @param {number} tenantId -
   * @param {string} jobId -
   * @returns {Promise<IJobMeta>}
   */
  async getJob(jobId: string): Promise<IJobMeta> {
    const jobs = await this.agenda.jobs({ _id: new ObjectId(jobId) });

    // Transformes job to json.
    const jobJson = this.transformJobToJson(first(jobs));

    return this.transformer.transform(null, jobJson, new JobTransformer());
  }

  /**
   * Transformes the job to json.
   * @param job
   * @returns
   */
  private transformJobToJson(job) {
    return {
      id: job.attrs._id,
      ...pick(job.attrs, [
        'nextRunAt',
        'lastModifiedBy',
        'lockedAt',
        'lastRunAt',
        'failCount',
        'failReason',
        'failedAt',
        'lastFinishedAt',
      ]),
      running: job.isRunning(),
    };
  }
}
