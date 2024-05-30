import { Knex } from 'knex';
import events from '@/subscribers/events';
import {
  IBillPaymentDTO,
  IBillPayment,
  IBillPaymentEventCreatedPayload,
  IBillPaymentCreatingPayload,
} from '@/interfaces';
import { TenantMetadata } from '@/system/models';
import { Inject, Service } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import { BillPaymentValidators } from './BillPaymentValidators';
import { CommandBillPaymentDTOTransformer } from './CommandBillPaymentDTOTransformer';

@Service()
export class CreateBillPayment {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private validators: BillPaymentValidators;

  @Inject()
  private commandTransformerDTO: CommandBillPaymentDTOTransformer;

  /**
   * Creates a new bill payment transcations and store it to the storage
   * with associated bills entries and journal transactions.
   * ------
   * Precedures:-
   * ------
   * - Records the bill payment transaction.
   * - Records the bill payment associated entries.
   * - Increment the payment amount of the given vendor bills.
   * - Decrement the vendor balance.
   * - Records payment journal entries.
   * ------
   * @param {number} tenantId - Tenant id.
   * @param {BillPaymentDTO} billPayment - Bill payment object.
   */
  public async createBillPayment(
    tenantId: number,
    billPaymentDTO: IBillPaymentDTO,
    trx?: Knex.Transaction
  ): Promise<IBillPayment> {
    const { BillPayment, Contact } = this.tenancy.models(tenantId);

    const tenantMeta = await TenantMetadata.query().findOne({ tenantId });

    // Retrieves the payment vendor or throw not found error.
    const vendor = await Contact.query()
      .findById(billPaymentDTO.vendorId)
      .modify('vendor')
      .throwIfNotFound();

    // Transform create DTO to model object.
    const billPaymentObj = await this.commandTransformerDTO.transformDTOToModel(
      tenantId,
      billPaymentDTO,
      vendor
    );
    // Validate the payment account existance and type.
    const paymentAccount = await this.validators.getPaymentAccountOrThrowError(
      tenantId,
      billPaymentObj.paymentAccountId
    );
    // Validate the payment number uniquiness.
    if (billPaymentObj.paymentNumber) {
      await this.validators.validatePaymentNumber(
        tenantId,
        billPaymentObj.paymentNumber
      );
    }
    // Validates the bills existance and associated to the given vendor.
    await this.validators.validateBillsExistance(
      tenantId,
      billPaymentObj.entries,
      billPaymentDTO.vendorId
    );
    // Validates the bills due payment amount.
    await this.validators.validateBillsDueAmount(
      tenantId,
      billPaymentObj.entries
    );
    // Validates the withdrawal account currency code.
    this.validators.validateWithdrawalAccountCurrency(
      paymentAccount.currencyCode,
      vendor.currencyCode,
      tenantMeta.baseCurrency
    );
    // Writes bill payment transacation with associated transactions
    // under unit-of-work envirement.
    return this.uow.withTransaction(
      tenantId,
      async (trx: Knex.Transaction) => {
        // Triggers `onBillPaymentCreating` event.
        await this.eventPublisher.emitAsync(events.billPayment.onCreating, {
          tenantId,
          billPaymentDTO,
          trx,
        } as IBillPaymentCreatingPayload);

        // Writes the bill payment graph to the storage.
        const billPayment = await BillPayment.query(trx).insertGraphAndFetch({
          ...billPaymentObj,
        });
        // Triggers `onBillPaymentCreated` event.
        await this.eventPublisher.emitAsync(events.billPayment.onCreated, {
          tenantId,
          billPayment,
          billPaymentId: billPayment.id,
          billPaymentDTO,
          trx,
        } as IBillPaymentEventCreatedPayload);

        return billPayment;
      },
      trx
    );
  }
}
