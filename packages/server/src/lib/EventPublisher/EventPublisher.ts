import { Container } from 'typedi';
import { EventEmitter2 } from 'eventemitter2';

interface IEventPublisherArgs {
  subscribers: EventSubscriber[];
}
class PublishEvent {
  constructor(public id: string) {}
}

type SubscribeListenerFunction = (event: PublishEvent) => void;
type SubscribeFunction = (id: string, cb: SubscribeListenerFunction) => void;

interface IEventBus {
  subscribe: SubscribeFunction;
}

export abstract class EventSubscriber {
  abstract attach(bus: IEventBus): void;
}

export class EventPublisher {
  private emitter: EventEmitter2;

  /**
   *
   * @param {IEventPublisherArgs} args
   */
  constructor() {
    this.emitter = new EventEmitter2({ wildcard: true, delimiter: '.' });
  }

  /**
   *
   * @param {EventSubscriber} args
   */
  loadSubscribers(subscribers: EventSubscriber[]) {
    const bus: IEventBus = {
      subscribe: (id, cb) => {
        this.emitter.on(id, cb);
      },
    };
    for (const Subscriber of subscribers) {
      const subscriberInstance = Container.get(Subscriber);
      subscriberInstance.attach(bus);
    }
  }

  /**
   *
   * @param event
   * @param payload
   */
  emit(event: string, payload) {
    return this.emitter.emit(event, payload);
  }

  /**
   *
   * @param event
   * @param payload
   */
  emitAsync(event: string, payload) {
    return this.emitter.emitAsync(event, payload);
  }
}
