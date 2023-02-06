import { Service, Inject } from 'typedi';
import events from '@/subscribers/events';
import { IOrganizationBuildEventPayload } from '@/interfaces';

@Service()
export default class OrgBuildSmsNotificationSubscriber {
  @Inject('agenda')
  agenda: any;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(events.organization.build, this.sendWelcomeSmsNotification);
  }

  /**
   * Sends welcome SMS once the organization build completed.
   */
  public sendWelcomeSmsNotification = async ({
    tenantId,
    systemUser,
  }: IOrganizationBuildEventPayload) => {
    // await this.agenda.now('welcome-sms', { tenant, user });
  };
}
