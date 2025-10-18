import {
  IPaymentReceivedCreatingPayload,
  IPaymentReceivedEditingPayload,
} from '@/modules/PaymentReceived/types/PaymentReceived.types';
import { ValidateBranchExistance } from '../../integrations/ValidateBranchExistance';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { events } from '@/common/events/events';

@Injectable()
export class PaymentReceiveBranchValidateSubscriber {
  constructor(
    private readonly validateBranchExistance: ValidateBranchExistance,
  ) { }

  /**
   * Validate branch existance on estimate creating.
   * @param {IPaymentReceivedCreatingPayload} payload
   */
  @OnEvent(events.paymentReceive.onCreating)
  async validateBranchExistanceOnPaymentCreating({
    paymentReceiveDTO,
  }: IPaymentReceivedCreatingPayload) {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      paymentReceiveDTO.branchId,
    );
  }

  /**
   * Validate branch existance once estimate editing.
   * @param {IPaymentReceivedEditingPayload} payload
   */
  @OnEvent(events.paymentReceive.onEditing)
  async validateBranchExistanceOnPaymentEditing({
    paymentReceiveDTO,
  }: IPaymentReceivedEditingPayload) {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      paymentReceiveDTO.branchId,
    );
  }
}
