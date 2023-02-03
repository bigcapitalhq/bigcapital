import events from '@/subscribers/events';
import { EventSubscriber } from '@/lib/EventPublisher/EventPublisher';
import { Service } from 'typedi';

@Service()
export default class ItemSubscriber extends EventSubscriber {
  /**
   * Attaches the events with handles.
   * @param bus 
   */
  attach(bus) {
    bus.subscribe(events.item.onCreated, this.handleItemCreated);
  }

  handleItemCreated() {
   
  }
}
