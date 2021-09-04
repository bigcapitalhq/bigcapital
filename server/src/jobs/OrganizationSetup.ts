import { Container } from 'typedi';
import OrganizationService from 'services/Organization';

export default class OrganizationSetupJob {
  /**
   * Constructor method.
   */
  constructor(agenda) {
    agenda.define(
      'organization-setup',
      { priority: 'high', concurrency: 1 },
      this.handler
    );
  }

  /**
   * Handle job action.
   */
  async handler(job, done: Function): Promise<void> {
    const { tenantId, _id } = job.attrs.data;
    const licenseService = Container.get(OrganizationService);

    try {
      await licenseService.build(tenantId);
      done();
    } catch (e) {
      // Unlock build status of the tenant.
      await licenseService.revertBuildRunJob(tenantId, _id);
      done(e);
    }
  }
}
