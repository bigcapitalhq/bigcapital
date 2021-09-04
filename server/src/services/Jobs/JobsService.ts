import { pick, first } from 'lodash';
import { ObjectId } from 'mongodb';
import { Service, Inject } from 'typedi';
import JobTransformer from './JobTransformer';
import { IJobMeta } from 'interfaces';

@Service()
export default class JobsService {
  @Inject('agenda')
  agenda: any;

  @Inject()
  jobsTransformer: JobTransformer;

  /**
   * Retrieve job details of the given job id.
   * @param {string} jobId
   * @returns {Promise<IJobMeta>}
   */
  async getJob(jobId: string): Promise<IJobMeta> {
    const jobs = await this.agenda.jobs({ _id: new ObjectId(jobId) });

    // Transformes job to json.
    const jobJson = this.transformJobToJson(first(jobs));

    return this.jobsTransformer.transform(jobJson);
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
