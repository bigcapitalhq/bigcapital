import { Container } from 'typedi';
import OrganizationService from '@/services/Organization/OrganizationService';

export default class OrganizationSetupJob {
  /**
   * Constructor method.
   */
  constructor(agenda) {
    agenda.define(
      'organization-setup',
      { priority: 'high', concurrency: 20 },
      this.handler
    );
  }

  /**
   * Handle job action.
   */
  async handler(job, done: Function): Promise<void> {
    const { tenantId, buildDTO, authorizedUser, _id } = job.attrs.data;
    const organizationService = Container.get(OrganizationService);

    try {
      await organizationService.build(tenantId, buildDTO, authorizedUser);
      done();
    } catch (e) {
      // Unlock build status of the tenant.
      await organizationService.revertBuildRunJob(tenantId, _id);

      console.error(e);
      done(e);
    }
  }
}
