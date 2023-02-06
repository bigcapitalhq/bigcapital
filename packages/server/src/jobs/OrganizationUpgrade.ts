import { Container } from 'typedi';
import OrganizationUpgrade from '@/services/Organization/OrganizationUpgrade';

export default class OrganizationUpgradeJob {
  /**
   * Constructor method.
   */
  constructor(agenda) {
    agenda.define(
      'organization-upgrade',
      { priority: 'high', concurrency: 1 },
      this.handler
    );
  }

  /**
   * Handle job action.
   */
  async handler(job, done: Function): Promise<void> {
    const { tenantId, _id } = job.attrs.data;
    const organizationUpgrade = Container.get(OrganizationUpgrade);

    try {
      await organizationUpgrade.upgradeJob(tenantId);
      done();
    } catch (e) {
      console.error(e);
      done(e);
    }
  }
}
