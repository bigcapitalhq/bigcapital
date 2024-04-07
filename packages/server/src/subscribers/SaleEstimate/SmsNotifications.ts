import { ISaleEstimateCreatedPayload } from '@/interfaces';
import { SaleEstimateNotifyBySms } from '@/services/Sales/Estimates/SaleEstimateSmsNotify';
import { runAfterTransaction } from '@/services/UnitOfWork/TransactionsHooks';
import events from '@/subscribers/events';
import { Inject, Service } from 'typedi';

@Service()
export default class SaleEstimateSmsNotificationSubscriber {
  @Inject()
  private saleEstimateNotifyBySms: SaleEstimateNotifyBySms;

  /**
   * Attaches events to handles.events.saleEstimate.onCreated
   */
  public attach(bus) {
    bus.subscribe(events.saleEstimate.onCreated, this.handleNotifySmSNotificationAfterCreation);
  }

  /**
   * Notify via SMS notification after sale estimate creation.
   */
  private handleNotifySmSNotificationAfterCreation = async ({
    tenantId,
    saleEstimateId,
    saleEstimate,
    trx,
  }: ISaleEstimateCreatedPayload) => {
    // Can't continue if estimate is not delivered.
    if (!saleEstimate.isDelivered) return;

    runAfterTransaction(trx, async () => {
      try {
        await this.saleEstimateNotifyBySms.notifyViaSmsNotificationAfterCreation(tenantId, saleEstimateId);
      } catch (error) {}
    });
  };
}
