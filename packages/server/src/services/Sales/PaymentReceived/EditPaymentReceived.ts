import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import {
  ICustomer,
  IPaymentReceived,
  IPaymentReceivedEditDTO,
  IPaymentReceivedEditedPayload,
  IPaymentReceivedEditingPayload,
  ISystemUser,
} from '@/interfaces';
import { PaymentReceiveDTOTransformer } from './PaymentReceivedDTOTransformer';
import { PaymentReceivedValidators } from './PaymentReceivedValidators';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';
import UnitOfWork from '@/services/UnitOfWork';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { TenantMetadata } from '@/system/models';

@Service()
export class EditPaymentReceived {
  @Inject()
  private transformer: PaymentReceiveDTOTransformer;

  @Inject()
  private validators: PaymentReceivedValidators;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private tenancy: HasTenancyService;

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
   * @param {number} tenantId -
   * @param {Integer} paymentReceiveId -
   * @param {IPaymentReceived} paymentReceive -
   */
  public async editPaymentReceive(
    tenantId: number,
    paymentReceiveId: number,
    paymentReceiveDTO: IPaymentReceivedEditDTO,
    authorizedUser: ISystemUser
  ) {
    const { PaymentReceive, Contact } = this.tenancy.models(tenantId);

    const tenantMeta = await TenantMetadata.query().findOne({ tenantId });

    // Validate the payment receive existance.
    const oldPaymentReceive = await PaymentReceive.query()
      .withGraphFetched('entries')
      .findById(paymentReceiveId)
      .throwIfNotFound();

    // Validates the payment existance.
    this.validators.validatePaymentExistance(oldPaymentReceive);

    // Validate customer existance.
    const customer = await Contact.query()
      .modify('customer')
      .findById(paymentReceiveDTO.customerId)
      .throwIfNotFound();

    // Transformes the payment receive DTO to model.
    const paymentReceiveObj = await this.transformEditDTOToModel(
      tenantId,
      customer,
      paymentReceiveDTO,
      oldPaymentReceive
    );
    // Validate customer whether modified.
    this.validators.validateCustomerNotModified(
      paymentReceiveDTO,
      oldPaymentReceive
    );
    // Validate payment receive number uniquiness.
    if (paymentReceiveDTO.paymentReceiveNo) {
      await this.validators.validatePaymentReceiveNoExistance(
        tenantId,
        paymentReceiveDTO.paymentReceiveNo,
        paymentReceiveId
      );
    }
    // Validate the deposit account existance and type.
    const depositAccount = await this.validators.getDepositAccountOrThrowError(
      tenantId,
      paymentReceiveDTO.depositAccountId
    );
    // Validate the entries ids existance on payment receive type.
    await this.validators.validateEntriesIdsExistance(
      tenantId,
      paymentReceiveId,
      paymentReceiveDTO.entries
    );
    // Validate payment receive invoices IDs existance and associated
    // to the given customer id.
    await this.validators.validateInvoicesIDsExistance(
      tenantId,
      oldPaymentReceive.customerId,
      paymentReceiveDTO.entries
    );
    // Validate invoice payment amount.
    await this.validators.validateInvoicesPaymentsAmount(
      tenantId,
      paymentReceiveDTO.entries,
      oldPaymentReceive.entries
    );
    // Validates the payment account currency code.
    this.validators.validatePaymentAccountCurrency(
      depositAccount.currencyCode,
      customer.currencyCode,
      tenantMeta.baseCurrency
    );
    // Creates payment receive transaction under UOW envirement.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onPaymentReceiveEditing` event.
      await this.eventPublisher.emitAsync(events.paymentReceive.onEditing, {
        trx,
        tenantId,
        oldPaymentReceive,
        paymentReceiveDTO,
      } as IPaymentReceivedEditingPayload);

      // Update the payment receive transaction.
      const paymentReceive = await PaymentReceive.query(
        trx
      ).upsertGraphAndFetch({
        id: paymentReceiveId,
        ...paymentReceiveObj,
      });
      // Triggers `onPaymentReceiveEdited` event.
      await this.eventPublisher.emitAsync(events.paymentReceive.onEdited, {
        tenantId,
        paymentReceiveId,
        paymentReceive,
        oldPaymentReceive,
        paymentReceiveDTO,
        authorizedUser,
        trx,
      } as IPaymentReceivedEditedPayload);

      return paymentReceive;
    });
  }

  /**
   * Transform the edit payment receive DTO.
   * @param {number} tenantId
   * @param {ICustomer} customer
   * @param {IPaymentReceivedEditDTO} paymentReceiveDTO
   * @param {IPaymentReceived} oldPaymentReceive
   * @returns
   */
  private transformEditDTOToModel = async (
    tenantId: number,
    customer: ICustomer,
    paymentReceiveDTO: IPaymentReceivedEditDTO,
    oldPaymentReceive: IPaymentReceived
  ) => {
    return this.transformer.transformPaymentReceiveDTOToModel(
      tenantId,
      customer,
      paymentReceiveDTO,
      oldPaymentReceive
    );
  };
}
