import { Inject, Service } from 'typedi';
import { AutoApplyPrepardExpenses } from '../AutoApplyPrepardExpenses';
import events from '@/subscribers/events';
import { IBillCreatedPayload } from '@/interfaces';

@Service()
export class AutoApplyPrepardExpensesOnBillCreated {
  @Inject()
  private autoApplyPrepardExpenses: AutoApplyPrepardExpenses;

  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(
      events.bill.onCreated,
      this.handleAutoApplyPrepardExpensesOnBillCreated.bind(this)
    );
  }

  /**
   * Handles the auto apply prepard expenses on bill created.
   * @param {IBillCreatedPayload} payload -
   */
  private async handleAutoApplyPrepardExpensesOnBillCreated({
    tenantId,
    billId,
    trx,
  }: IBillCreatedPayload) {
    await this.autoApplyPrepardExpenses.autoApplyPrepardExpensesToBill(
      tenantId,
      billId,
      trx
    );
  }
}
