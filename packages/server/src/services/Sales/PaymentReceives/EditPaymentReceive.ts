import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import {
  ICustomer,
  IPaymentReceive,
  IPaymentReceiveEditDTO,
  IPaymentReceiveEditedPayload,
  IPaymentReceiveEditingPayload,
  ISystemUser,
} from '@/interfaces';
import { PaymentReceiveDTOTransformer } from './PaymentReceiveDTOTransformer';
import { PaymentReceiveValidators } from './PaymentReceiveValidators';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';
import UnitOfWork from '@/services/UnitOfWork';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { TenantMetadata } from '@/system/models';

@Service()
export class EditPaymentReceive {
  @Inject()
  private transformer: PaymentReceiveDTOTransformer;

  @Inject()
  private validators: PaymentReceiveValidators;

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
   * @param {IPaymentReceive} paymentReceive -
   */
  public async editPaymentReceive(
    tenantId: number,
    paymentReceiveId: number,
    paymentReceiveDTO: IPaymentReceiveEditDTO,
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
      } as IPaymentReceiveEditingPayload);

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
        authorizedUser,
        trx,
      } as IPaymentReceiveEditedPayload);

      return paymentReceive;
    });
  }

  /**
   * Transform the edit payment receive DTO.
   * @param {number} tenantId
   * @param {ICustomer} customer
   * @param {IPaymentReceiveEditDTO} paymentReceiveDTO
   * @param {IPaymentReceive} oldPaymentReceive
   * @returns
   */
  private transformEditDTOToModel = async (
    tenantId: number,
    customer: ICustomer,
    paymentReceiveDTO: IPaymentReceiveEditDTO,
    oldPaymentReceive: IPaymentReceive
  ) => {
    return this.transformer.transformPaymentReceiveDTOToModel(
      tenantId,
      customer,
      paymentReceiveDTO,
      oldPaymentReceive
    );
  };
}
