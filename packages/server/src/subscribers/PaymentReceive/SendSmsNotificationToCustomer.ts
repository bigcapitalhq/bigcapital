import { Service, Inject } from 'typedi';
import events from '@/subscribers/events';
import { PaymentReceiveNotifyBySms } from '@/services/Sales/PaymentReceived/PaymentReceivedSmsNotify';
import { IPaymentReceivedCreatedPayload } from '@/interfaces';
import { runAfterTransaction } from '@/services/UnitOfWork/TransactionsHooks';

@Service()
export default class SendSmsNotificationPaymentReceive {
  @Inject()
  private paymentReceiveSmsNotify: PaymentReceiveNotifyBySms;

  /**
   * Attach events.
   */
  public attach(bus) {
    bus.subscribe(
      events.paymentReceive.onCreated,
      this.handleNotifyViaSmsOncePaymentPublish
    );
  }

  /**
   * Handles send SMS notification after payment transaction creation.
   */
  private handleNotifyViaSmsOncePaymentPublish = ({
    tenantId,
    paymentReceiveId,
    trx,
  }: IPaymentReceivedCreatedPayload) => {
    // Notify via Sms after transactions complete running.
    runAfterTransaction(trx, async () => {
      try {
        await this.paymentReceiveSmsNotify.notifyViaSmsNotificationAfterCreation(
          tenantId,
          paymentReceiveId
        );
      } catch (error) { }
    });
  };
}
