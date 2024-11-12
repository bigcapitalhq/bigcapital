import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ItemCreatedEvent } from '../events/ItemCreated.event';

@Injectable()
export class ItemCreatedListener {

  @OnEvent('order.created')
  handleItemCreatedEvent(event: ItemCreatedEvent) {
    // handle and process "OrderCreatedEvent" event
    console.log(event);
  }
}