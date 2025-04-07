import { Knex } from 'knex';
import {
  IPaymentReceivedCreateDTO,
  IPaymentReceivedCreatedPayload,
  IPaymentReceivedCreatingPayload,
} from '../types/PaymentReceived.types';
import { PaymentReceivedValidators } from './PaymentReceivedValidators.service';
import { PaymentReceiveDTOTransformer } from './PaymentReceivedDTOTransformer';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentReceived } from '../models/PaymentReceived';
import { events } from '@/common/events/events';
import { Customer } from '@/modules/Customers/models/Customer';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { CreatePaymentReceivedDto } from '../dtos/PaymentReceived.dto';

@Injectable()
export class CreatePaymentReceivedService {
  constructor(
    private validators: PaymentReceivedValidators,
    private eventPublisher: EventEmitter2,
    private uow: UnitOfWork,
    private transformer: PaymentReceiveDTOTransformer,
    private tenancyContext: TenancyContext,

    @Inject(PaymentReceived.name)
    private paymentReceived: TenantModelProxy<typeof PaymentReceived>,

    @Inject(Customer.name)
    private customer: TenantModelProxy<typeof Customer>,
  ) {}

  /**
   * Creates a new payment receive and store it to the storage
   * with associated invoices payment and journal transactions.
   * @param {IPaymentReceivedCreateDTO} paymentReceiveDTO - Payment receive create DTO.
   * @param {Knex.Transaction} trx - Database transaction.
   */
  public async createPaymentReceived(
    paymentReceiveDTO: CreatePaymentReceivedDto,
    trx?: Knex.Transaction,
  ) {
    const tenant = await this.tenancyContext.getTenant(true);

    // Validate customer existance.
    const paymentCustomer = await this.customer()
      .query()
      .findById(paymentReceiveDTO.customerId)
      .throwIfNotFound();

    // Transformes the payment receive DTO to model.
    const paymentReceiveObj = await this.transformCreateDTOToModel(
      paymentCustomer,
      paymentReceiveDTO,
    );
    // Validate payment receive number uniquiness.
    await this.validators.validatePaymentReceiveNoExistance(
      paymentReceiveObj.paymentReceiveNo,
    );
    // Validate the deposit account existance and type.
    const depositAccount = await this.validators.getDepositAccountOrThrowError(
      paymentReceiveDTO.depositAccountId,
    );
    // Validate payment receive invoices IDs existance.
    await this.validators.validateInvoicesIDsExistance(
      paymentReceiveDTO.customerId,
      paymentReceiveDTO.entries,
    );
    // Validate invoice payment amount.
    await this.validators.validateInvoicesPaymentsAmount(
      paymentReceiveDTO.entries,
    );
    // Validates the payment account currency code.
    this.validators.validatePaymentAccountCurrency(
      depositAccount.currencyCode,
      paymentCustomer.currencyCode,
      tenant?.metadata.baseCurrency,
    );
    // Creates a payment receive transaction under UOW envirment.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onPaymentReceiveCreating` event.
      await this.eventPublisher.emitAsync(events.paymentReceive.onCreating, {
        trx,
        paymentReceiveDTO,
      } as IPaymentReceivedCreatingPayload);

      // Inserts the payment receive transaction.
      const paymentReceive = await this.paymentReceived()
        .query(trx)
        .insertGraphAndFetch({
          ...paymentReceiveObj,
        });
      // Triggers `onPaymentReceiveCreated` event.
      await this.eventPublisher.emitAsync(events.paymentReceive.onCreated, {
        paymentReceive,
        paymentReceiveId: paymentReceive.id,
        paymentReceiveDTO,
        trx,
      } as IPaymentReceivedCreatedPayload);

      return paymentReceive;
    }, trx);
  }

  /**
   * Transform the create payment receive DTO.
   * @param {ICustomer} customer
   * @param {IPaymentReceivedCreateDTO} paymentReceiveDTO
   * @returns
   */
  private transformCreateDTOToModel = async (
    customer: Customer,
    paymentReceiveDTO: IPaymentReceivedCreateDTO,
  ) => {
    return this.transformer.transformPaymentReceiveDTOToModel(
      customer,
      paymentReceiveDTO,
    );
  };
}
