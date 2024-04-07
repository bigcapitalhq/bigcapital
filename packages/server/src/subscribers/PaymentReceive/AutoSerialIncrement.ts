import { IPaymentReceiveCreatedPayload } from '@/interfaces';
import { EventSubscriber } from '@/lib/EventPublisher/EventPublisher';
import { PaymentReceiveIncrement } from '@/services/Sales/PaymentReceives/PaymentReceiveIncrement';
import events from '@/subscribers/events';
import { Inject, Service } from 'typedi';

@Service()
export default class PaymentReceiveAutoSerialSubscriber extends EventSubscriber {
  @Inject()
  private paymentIncrement: PaymentReceiveIncrement;

  /**
   * Attaches the events with handles.
   * @param bus
   */
  public attach(bus) {
    bus.subscribe(events.paymentReceive.onCreated, this.handlePaymentNextNumberIncrement);
  }

  /**
   * Handles increment next number of payment receive once be created.
   * @param {IPaymentReceiveCreatedPayload} payload -
   */
  private handlePaymentNextNumberIncrement = async ({
    tenantId,
    paymentReceiveId,
    trx,
  }: IPaymentReceiveCreatedPayload) => {
    await this.paymentIncrement.incrementNextPaymentReceiveNumber(tenantId);
  };
}
