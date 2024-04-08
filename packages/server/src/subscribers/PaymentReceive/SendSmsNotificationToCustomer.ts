import { IPaymentReceiveCreatedPayload } from '@/interfaces';
import { PaymentReceiveNotifyBySms } from '@/services/Sales/PaymentReceives/PaymentReceiveSmsNotify';
import { runAfterTransaction } from '@/services/UnitOfWork/TransactionsHooks';
import events from '@/subscribers/events';
import { Inject, Service } from 'typedi';

@Service()
export default class SendSmsNotificationPaymentReceive {
  @Inject()
  private paymentReceiveSmsNotify: PaymentReceiveNotifyBySms;

  /**
   * Attach events.
   */
  public attach(bus) {
    bus.subscribe(events.paymentReceive.onCreated, this.handleNotifyViaSmsOncePaymentPublish);
  }

  /**
   * Handles send SMS notification after payment transaction creation.
   */
  private handleNotifyViaSmsOncePaymentPublish = ({
    tenantId,
    paymentReceiveId,
    trx,
  }: IPaymentReceiveCreatedPayload) => {
    // Notify via Sms after transactions complete running.
    runAfterTransaction(trx, async () => {
      try {
        await this.paymentReceiveSmsNotify.notifyViaSmsNotificationAfterCreation(tenantId, paymentReceiveId);
      } catch (error) {}
    });
  };
}
