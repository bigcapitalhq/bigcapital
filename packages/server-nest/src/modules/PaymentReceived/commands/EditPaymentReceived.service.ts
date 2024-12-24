import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  IPaymentReceivedEditDTO,
  IPaymentReceivedEditedPayload,
  IPaymentReceivedEditingPayload,
} from '../types/PaymentReceived.types';
import { PaymentReceiveDTOTransformer } from './PaymentReceivedDTOTransformer';
import { PaymentReceivedValidators } from './PaymentReceivedValidators.service';
import { PaymentReceived } from '../models/PaymentReceived';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { events } from '@/common/events/events';
import { Customer } from '@/modules/Customers/models/Customer';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';

@Injectable()
export class EditPaymentReceived {
  constructor(
    private readonly transformer: PaymentReceiveDTOTransformer,
    private readonly validators: PaymentReceivedValidators,
    private readonly eventPublisher: EventEmitter2,
    private readonly uow: UnitOfWork,
    private readonly tenancyContext: TenancyContext,

    @Inject(PaymentReceived)
    private readonly paymentReceiveModel: typeof PaymentReceived,

    @Inject(Customer.name)
    private readonly customerModel: typeof Customer,
  ) {}

  /**
   * Edit details the given payment receive with associated entries.
   * ------
   * - Update the payment receive transactions.
   * - Insert the new payment receive entries.
   * - Update the given payment receive entries.
   * - Delete the not presented payment receive entries.
   * - Re-insert the journal transactions and update the different accounts balance.
   * - Update the different customer balances.
   * - Update the different invoice payment amount.
   * @async
   * @param {number} paymentReceiveId -
   * @param {IPaymentReceivedEditDTO} paymentReceiveDTO -
   */
  public async editPaymentReceive(
    paymentReceiveId: number,
    paymentReceiveDTO: IPaymentReceivedEditDTO,
  ) {
    const tenant = await this.tenancyContext.getTenant(true);

    // Validate the payment receive existance.
    const oldPaymentReceive = await this.paymentReceiveModel
      .query()
      .withGraphFetched('entries')
      .findById(paymentReceiveId)
      .throwIfNotFound();

    // Validates the payment existance.
    this.validators.validatePaymentExistance(oldPaymentReceive);

    // Validate customer existance.
    const customer = await this.customerModel
      .query()
      .findById(paymentReceiveDTO.customerId)
      .throwIfNotFound();

    // Transformes the payment receive DTO to model.
    const paymentReceiveObj = await this.transformEditDTOToModel(
      customer,
      paymentReceiveDTO,
      oldPaymentReceive,
    );
    // Validate customer whether modified.
    this.validators.validateCustomerNotModified(
      paymentReceiveDTO,
      oldPaymentReceive,
    );
    // Validate payment receive number uniquiness.
    if (paymentReceiveDTO.paymentReceiveNo) {
      await this.validators.validatePaymentReceiveNoExistance(
        paymentReceiveDTO.paymentReceiveNo,
        paymentReceiveId,
      );
    }
    // Validate the deposit account existance and type.
    const depositAccount = await this.validators.getDepositAccountOrThrowError(
      paymentReceiveDTO.depositAccountId,
    );
    // Validate the entries ids existance on payment receive type.
    await this.validators.validateEntriesIdsExistance(
      paymentReceiveId,
      paymentReceiveDTO.entries,
    );
    // Validate payment receive invoices IDs existance and associated
    // to the given customer id.
    await this.validators.validateInvoicesIDsExistance(
      oldPaymentReceive.customerId,
      paymentReceiveDTO.entries,
    );
    // Validate invoice payment amount.
    await this.validators.validateInvoicesPaymentsAmount(
      paymentReceiveDTO.entries,
      oldPaymentReceive.entries,
    );
    // Validates the payment account currency code.
    this.validators.validatePaymentAccountCurrency(
      depositAccount.currencyCode,
      customer.currencyCode,
      tenant?.metadata.baseCurrency,
    );
    // Creates payment receive transaction under UOW envirement.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onPaymentReceiveEditing` event.
      await this.eventPublisher.emitAsync(events.paymentReceive.onEditing, {
        trx,
        oldPaymentReceive,
        paymentReceiveDTO,
      } as IPaymentReceivedEditingPayload);

      // Update the payment receive transaction.
      const paymentReceive = await this.paymentReceiveModel
        .query(trx)
        .upsertGraphAndFetch({
          id: paymentReceiveId,
          ...paymentReceiveObj,
        });
      // Triggers `onPaymentReceiveEdited` event.
      await this.eventPublisher.emitAsync(events.paymentReceive.onEdited, {
        paymentReceiveId,
        paymentReceive,
        oldPaymentReceive,
        paymentReceiveDTO,
        trx,
      } as IPaymentReceivedEditedPayload);

      return paymentReceive;
    });
  }

  /**
   * Transform the edit payment receive DTO.
   * @param {ICustomer} customer
   * @param {IPaymentReceivedEditDTO} paymentReceiveDTO
   * @param {IPaymentReceived} oldPaymentReceive
   * @returns
   */
  private transformEditDTOToModel = async (
    customer: Customer,
    paymentReceiveDTO: IPaymentReceivedEditDTO,
    oldPaymentReceive: PaymentReceived,
  ) => {
    return this.transformer.transformPaymentReceiveDTOToModel(
      customer,
      paymentReceiveDTO,
      oldPaymentReceive,
    );
  };
}
