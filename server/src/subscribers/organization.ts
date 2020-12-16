import { Container } from 'typedi';
import { On, EventSubscriber } from "event-dispatch";
import events from 'subscribers/events';

@EventSubscriber()
export class OrganizationSubscriber {
  /**
   * Sends welcome SMS once the organization build completed.
   */
  @On(events.organization.build)
  public async onBuild({ tenant, user }) {
    const agenda = Container.get('agenda');
 
    await agenda.now('welcome-sms', { tenant, user });    
  }
}