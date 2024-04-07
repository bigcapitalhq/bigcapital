import BillsService from '@/services/Purchases/Bills';
import TenancyService from '@/services/Tenancy/TenancyService';
import { EventSubscriber } from 'event-dispatch';
import { Container } from 'typedi';

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
