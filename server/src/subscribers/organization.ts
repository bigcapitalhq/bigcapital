import { Container } from 'typedi';
import { On, EventSubscriber } from "event-dispatch";
import events from '@/subscribers/events';

@EventSubscriber()
export class OrganizationSubscriber {

  @On(events.organization.build)
  public onBuild(payload) {
    const agenda = Container.get('agenda');

    agenda.now('welcome-sms', {
      email, organizationName, firstName,
    });
  }
}