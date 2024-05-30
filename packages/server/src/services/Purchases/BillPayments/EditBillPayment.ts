import { Inject, Service } from 'typedi';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import { BillPaymentValidators } from './BillPaymentValidators';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import {
  IBillPayment,
  IBillPaymentEditingPayload,
  IBillPaymentEventEditedPayload,
} from '@/interfaces';
import events from '@/subscribers/events';
import { Knex } from 'knex';
import UnitOfWork from '@/services/UnitOfWork';
import { CommandBillPaymentDTOTransformer } from './CommandBillPaymentDTOTransformer';
import { TenantMetadata } from '@/system/models';

@Service()
export class EditBillPayment {
  @Inject()
  private validators: BillPaymentValidators;

  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private transformer: CommandBillPaymentDTOTransformer;

  /**
   * Edits the details of the given bill payment.
   *
   * Preceducres:
   * ------
   * - Update the bill payment transaction.
   * - Insert the new bill payment entries that have no ids.
   * - Update the bill paymeny entries that have ids.
   * - Delete the bill payment entries that not presented.
   * - Re-insert the journal transactions and update the diff accounts balance.
   * - Update the diff vendor balance.
   * - Update the diff bill payment amount.
   * ------
   * @param {number} tenantId - Tenant id
   * @param {Integer} billPaymentId
   * @param {BillPaymentDTO} billPayment
   * @param {IBillPayment} oldBillPayment
   */
  public async editBillPayment(
    tenantId: number,
    billPaymentId: number,
    billPaymentDTO
  ): Promise<IBillPayment> {
    const { BillPayment, Contact } = this.tenancy.models(tenantId);

    const tenantMeta = await TenantMetadata.query().findOne({ tenantId });

    const oldBillPayment = await BillPayment.query()
      .findById(billPaymentId)
      .withGraphFetched('entries')
      .throwIfNotFound();

    // Retrieves the bill payment vendor or throw not found error.
    const vendor = await Contact.query()
      .modify('vendor')
      .findById(billPaymentDTO.vendorId)
      .throwIfNotFound();

    // Transform bill payment DTO to model object.
    const billPaymentObj = await this.transformer.transformDTOToModel(
      tenantId,
      billPaymentDTO,
      vendor,
      oldBillPayment
    );
    // Validate vendor not modified.
    this.validators.validateVendorNotModified(billPaymentDTO, oldBillPayment);

    // Validate the payment account existance and type.
    const paymentAccount = await this.validators.getPaymentAccountOrThrowError(
      tenantId,
      billPaymentObj.paymentAccountId
    );
    // Validate the items entries IDs existance on the storage.
    await this.validators.validateEntriesIdsExistance(
      tenantId,
      billPaymentId,
      billPaymentObj.entries
    );
    // Validate the bills existance and associated to the given vendor.
    await this.validators.validateBillsExistance(
      tenantId,
      billPaymentObj.entries,
      billPaymentDTO.vendorId
    );
    // Validates the bills due payment amount.
    await this.validators.validateBillsDueAmount(
      tenantId,
      billPaymentObj.entries,
      oldBillPayment.entries
    );
    // Validate the payment number uniquiness.
    if (billPaymentObj.paymentNumber) {
      await this.validators.validatePaymentNumber(
        tenantId,
        billPaymentObj.paymentNumber,
        billPaymentId
      );
    }
    // Validates the withdrawal account currency code.
    this.validators.validateWithdrawalAccountCurrency(
      paymentAccount.currencyCode,
      vendor.currencyCode,
      tenantMeta.baseCurrency
    );
    // Edits the bill transactions with associated transactions
    // under unit-of-work envirement.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onBillPaymentEditing` event.
      await this.eventPublisher.emitAsync(events.billPayment.onEditing, {
        tenantId,
        oldBillPayment,
        billPaymentDTO,
        trx,
      } as IBillPaymentEditingPayload);

      // Edits the bill payment transaction graph on the storage.
      const billPayment = await BillPayment.query(trx).upsertGraphAndFetch({
        id: billPaymentId,
        ...billPaymentObj,
      });
      // Triggers `onBillPaymentEdited` event.
      await this.eventPublisher.emitAsync(events.billPayment.onEdited, {
        tenantId,
        billPaymentId,
        billPayment,
        oldBillPayment,
        billPaymentDTO,
        trx,
      } as IBillPaymentEventEditedPayload);

      return billPayment;
    });
  }
}
