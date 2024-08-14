import { Service, Inject } from 'typedi';
import events from '@/subscribers/events';
import { EventSubscriber } from '@/lib/EventPublisher/EventPublisher';
import { PaymentReceivedIncrement } from '@/services/Sales/PaymentReceived/PaymentReceivedIncrement';
import { IPaymentReceivedCreatedPayload } from '@/interfaces';

@Service()
export default class PaymentReceiveAutoSerialSubscriber extends EventSubscriber {
  @Inject()
  private paymentIncrement: PaymentReceivedIncrement;

  /**
   * Attaches the events with handles.
   * @param bus
   */
  public attach(bus) {
    bus.subscribe(
      events.paymentReceive.onCreated,
      this.handlePaymentNextNumberIncrement
    );
  }

  /**
   * Handles increment next number of payment receive once be created.
   * @param {IPaymentReceivedCreatedPayload} payload -
   */
  private handlePaymentNextNumberIncrement = async ({
    tenantId,
    paymentReceiveId,
    trx,
  }: IPaymentReceivedCreatedPayload) => {
    await this.paymentIncrement.incrementNextPaymentReceiveNumber(tenantId);
  };
}
