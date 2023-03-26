import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';

import events from '@/subscribers/events';
import TenancyService from '@/services/Tenancy/TenancyService';
import BillsService from '@/services/Purchases/Bills';

@EventSubscriber()
export default class BillSubscriber {
  tenancy: TenancyService;
  billsService: BillsService;
  logger: any;

  /**
   * Constructor method.
   */
  constructor() {
    this.tenancy = Container.get(TenancyService);
    this.billsService = Container.get(BillsService);
    this.logger = Container.get('logger');
  }
}
