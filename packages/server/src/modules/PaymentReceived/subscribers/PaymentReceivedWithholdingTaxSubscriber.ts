import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { PaymentReceivedWithholdingTax } from '../commands/PaymentReceivedWithholdingTax.service';
import {
  IPaymentReceivedCreatedPayload,
  IPaymentReceivedDeletedPayload,
} from '../types/PaymentReceived.types';

@Injectable()
export class PaymentReceivedWithholdingTaxSubscriber {
  constructor(
    private readonly withholdingTaxService: PaymentReceivedWithholdingTax,
  ) {}

  /**
   * Books the withheld tax portion once a net-of-withholding payment is
   * created for a customer with a withholding tax rate.
   */
  @OnEvent(events.paymentReceive.onCreated)
  public async handleWithholdingTaxOnPaymentCreated({
    paymentReceiveId,
    paymentReceiveDTO,
    trx,
  }: IPaymentReceivedCreatedPayload) {
    await this.withholdingTaxService.createWithheldPaymentIfApplies(
      paymentReceiveId,
      paymentReceiveDTO,
      trx,
    );
  }

  /**
   * Removes the companion withholding payment when the origin payment is
   * deleted.
   */
  @OnEvent(events.paymentReceive.onDeleted)
  public async handleWithholdingTaxOnPaymentDeleted({
    paymentReceiveId,
    trx,
  }: IPaymentReceivedDeletedPayload) {
    await this.withholdingTaxService.deleteWithheldPaymentIfExists(
      paymentReceiveId,
      trx,
    );
  }
}
