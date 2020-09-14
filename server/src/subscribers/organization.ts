import { Container } from 'typedi';
import { On, EventSubscriber } from "event-dispatch";
import events from 'subscribers/events';

@EventSubscriber()
export class OrganizationSubscriber {

  @On(events.organization.build)
  public async onBuild(payload) {
    const { tenant, user } = payload;
    const agenda = Container.get('agenda');

    await agenda.now('welcome-sms', { tenant, user });
  }
}