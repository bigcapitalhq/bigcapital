import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import events from 'subscribers/events';
import ItemsService from 'services/Items/ItemsService';

@EventSubscriber()
export default class ItemsSubscriber{
  itemsService: ItemsService;

  constructor() {
    this.itemsService = Container.get(ItemsService);
  };
}