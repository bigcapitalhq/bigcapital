import events from '@/subscribers/events';
import { EventSubscriber, On } from 'event-dispatch';
import { Container } from 'typedi';
import PaymentReceiveNotifyBySms from './PaymentReceiveSmsNotify';

@EventSubscriber()
export default class SendSmsNotificationPaymentReceive {
  paymentReceiveNotifyBySms: PaymentReceiveNotifyBySms;

  constructor() {
    this.paymentReceiveNotifyBySms = Container.get(PaymentReceiveNotifyBySms);
  }

  /**
   *
   */
  @On(events.paymentReceive.onNotifySms)
  async sendSmsNotificationOnceInvoiceNotify({ paymentReceive, customer }) {
    await this.paymentReceiveNotifyBySms.sendSmsNotification(paymentReceive, customer);
  }
}
