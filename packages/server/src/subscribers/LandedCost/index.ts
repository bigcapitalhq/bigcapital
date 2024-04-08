import BillsService from '@/services/Purchases/Bills';
import TenancyService from '@/services/Tenancy/TenancyService';
import events from '@/subscribers/events';
import { EventSubscriber, On } from 'event-dispatch';
import { Container } from 'typedi';

@EventSubscriber()
export default class BillLandedCostSubscriber {
  logger: any;
  tenancy: TenancyService;
  billsService: BillsService;

  /**
   * Constructor method.
   */
  constructor() {
    this.logger = Container.get('logger');
    this.tenancy = Container.get(TenancyService);
    this.billsService = Container.get(BillsService);
  }

  /**
   * Marks the rewrite bill journal entries once the landed cost transaction
   * be deleted or created.
   */
  @On(events.billLandedCost.onCreated)
  @On(events.billLandedCost.onDeleted)
  public async handleRewriteBillJournalEntries({ tenantId, billId, bilLandedCostId }) {
    // Overwrite the journal entries for the given bill transaction.
    this.logger.info('[bill] overwriting bill journal entries.', { tenantId });
    await this.billsService.recordJournalTransactions(tenantId, billId, true);
  }
}
