import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import {
  ICustomer,
  IPaymentReceiveCreateDTO,
  IPaymentReceiveCreatedPayload,
  IPaymentReceiveCreatingPayload,
  ISystemUser,
} from '@/interfaces';
import { PaymentReceiveValidators } from './PaymentReceiveValidators';
import events from '@/subscribers/events';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import { PaymentReceiveDTOTransformer } from './PaymentReceiveDTOTransformer';
import { TenantMetadata } from '@/system/models';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';

@Service()
export class CreatePaymentReceive {
  @Inject()
  private validators: PaymentReceiveValidators;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private transformer: PaymentReceiveDTOTransformer;

  /**
   * Creates a new payment receive and store it to the storage
   * with associated invoices payment and journal transactions.
   * @async
   * @param {number} tenantId - Tenant id.
   * @param {IPaymentReceive} paymentReceive
   */
  public async createPaymentReceive(
    tenantId: number,
    paymentReceiveDTO: IPaymentReceiveCreateDTO,
    authorizedUser: ISystemUser,
    trx?: Knex.Transaction
  ) {
    const { PaymentReceive, Contact } = this.tenancy.models(tenantId);

    const tenantMeta = await TenantMetadata.query().findOne({ tenantId });

    // Validate customer existance.
    const paymentCustomer = await Contact.query()
      .modify('customer')
      .findById(paymentReceiveDTO.customerId)
      .throwIfNotFound();

    // Transformes the payment receive DTO to model.
    const paymentReceiveObj = await this.transformCreateDTOToModel(
      tenantId,
      paymentCustomer,
      paymentReceiveDTO
    );
    // Validate payment receive number uniquiness.
    await this.validators.validatePaymentReceiveNoExistance(
      tenantId,
      paymentReceiveObj.paymentReceiveNo
    );
    // Validate the deposit account existance and type.
    const depositAccount = await this.validators.getDepositAccountOrThrowError(
      tenantId,
      paymentReceiveDTO.depositAccountId
    );
    // Validate payment receive invoices IDs existance.
    await this.validators.validateInvoicesIDsExistance(
      tenantId,
      paymentReceiveDTO.customerId,
      paymentReceiveDTO.entries
    );
    // Validate invoice payment amount.
    await this.validators.validateInvoicesPaymentsAmount(
      tenantId,
      paymentReceiveDTO.entries
    );
    // Validates the payment account currency code.
    this.validators.validatePaymentAccountCurrency(
      depositAccount.currencyCode,
      paymentCustomer.currencyCode,
      tenantMeta.baseCurrency
    );
    // Creates a payment receive transaction under UOW envirment.
    return this.uow.withTransaction(
      tenantId,
      async (trx: Knex.Transaction) => {
        // Triggers `onPaymentReceiveCreating` event.
        await this.eventPublisher.emitAsync(events.paymentReceive.onCreating, {
          trx,
          paymentReceiveDTO,
          tenantId,
        } as IPaymentReceiveCreatingPayload);

        // Inserts the payment receive transaction.
        const paymentReceive = await PaymentReceive.query(
          trx
        ).insertGraphAndFetch({
          ...paymentReceiveObj,
        });
        // Triggers `onPaymentReceiveCreated` event.
        await this.eventPublisher.emitAsync(events.paymentReceive.onCreated, {
          tenantId,
          paymentReceive,
          paymentReceiveId: paymentReceive.id,
          authorizedUser,
          trx,
        } as IPaymentReceiveCreatedPayload);

        return paymentReceive;
      },
      trx
    );
  }

  /**
   * Transform the create payment receive DTO.
   * @param {number} tenantId
   * @param {ICustomer} customer
   * @param {IPaymentReceiveCreateDTO} paymentReceiveDTO
   * @returns
   */
  private transformCreateDTOToModel = async (
    tenantId: number,
    customer: ICustomer,
    paymentReceiveDTO: IPaymentReceiveCreateDTO
  ) => {
    return this.transformer.transformPaymentReceiveDTOToModel(
      tenantId,
      customer,
      paymentReceiveDTO
    );
  };
}
