import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import { AutoApplyUnearnedRevenue } from '../AutoApplyUnearnedRevenue';

@Service()
export class AutoApplyUnearnedRevenueOnInvoiceCreated {
  @Inject()
  private autoApplyUnearnedRevenue: AutoApplyUnearnedRevenue;
  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(
      events.saleInvoice.onCreated,
      this.handleAutoApplyUnearnedRevenueOnInvoiceCreated.bind(this)
    );
  }

  /**
   * Handles the auto apply unearned revenue on invoice creating.
   * @param 
   */
  private async handleAutoApplyUnearnedRevenueOnInvoiceCreated({
    tenantId,
    saleInvoice,
    trx,
  }) {
    await this.autoApplyUnearnedRevenue.autoApplyUnearnedRevenueToInvoice(
      tenantId,
      saleInvoice.id,
      trx
    );
  }
}
