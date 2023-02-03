import { Service, Inject } from 'typedi';
import events from '@/subscribers/events';
import { EventSubscriber } from '@/lib/EventPublisher/EventPublisher';
import PaymentReceiveService from '@/services/Sales/PaymentReceives/PaymentsReceives';
import { IPaymentReceiveCreatedPayload } from '@/interfaces';

@Service()
export default class PaymentReceiveAutoSerialSubscriber extends EventSubscriber {
  @Inject()
  paymentReceivesService: PaymentReceiveService;

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
   * @param {IPaymentReceiveCreatedPayload} payload -
   */
  private handlePaymentNextNumberIncrement = async ({
    tenantId,
    paymentReceiveId,
    trx,
  }: IPaymentReceiveCreatedPayload) => {
    await this.paymentReceivesService.incrementNextPaymentReceiveNumber(
      tenantId
    );
  };
}
