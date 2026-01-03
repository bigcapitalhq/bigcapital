import { Inject, Injectable } from '@nestjs/common';
import { BillPaymentValidators } from './BillPaymentValidators.service';
import {
  IBillPaymentEditingPayload,
  IBillPaymentEventEditedPayload,
} from '../types/BillPayments.types';
import { Knex } from 'knex';
import { BillPayment } from '../models/BillPayment';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { CommandBillPaymentDTOTransformer } from './CommandBillPaymentDTOTransformer.service';
import { Vendor } from '@/modules/Vendors/models/Vendor';
import { events } from '@/common/events/events';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { EditBillPaymentDto } from '../dtos/BillPayment.dto';

@Injectable()
export class EditBillPayment {
  constructor(
    private readonly validators: BillPaymentValidators,
    private readonly eventPublisher: EventEmitter2,
    private readonly uow: UnitOfWork,
    private readonly transformer: CommandBillPaymentDTOTransformer,
    private readonly tenancyContext: TenancyContext,

    @Inject(BillPayment.name)
    private readonly billPaymentModel: TenantModelProxy<typeof BillPayment>,

    @Inject(Vendor.name)
    private readonly vendorModel: TenantModelProxy<typeof Vendor>,
  ) { }

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
   * @param {Integer} billPaymentId
   * @param {EditBillPaymentDto} billPayment
   * @param {BillPayment} oldBillPayment
   */
  public async editBillPayment(
    billPaymentId: number,
    billPaymentDTO: EditBillPaymentDto,
  ): Promise<BillPayment> {
    const tenantMeta = await this.tenancyContext.getTenant(true);

    const oldBillPayment = await this.billPaymentModel()
      .query()
      .findById(billPaymentId)
      .withGraphFetched('entries')
      .throwIfNotFound();

    const vendor = await this.vendorModel()
      .query()
      .findById(billPaymentDTO.vendorId)
      .throwIfNotFound();

    const billPaymentObj = await this.transformer.transformDTOToModel(
      billPaymentDTO,
      vendor,
      oldBillPayment,
    );
    // Validate vendor not modified.
    this.validators.validateVendorNotModified(billPaymentDTO, oldBillPayment);

    // Validate the payment account existance and type.
    const paymentAccount = await this.validators.getPaymentAccountOrThrowError(
      billPaymentObj.paymentAccountId,
    );
    // Validate the items entries IDs existance on the storage.
    await this.validators.validateEntriesIdsExistance(
      billPaymentId,
      billPaymentObj.entries,
    );
    // Validate the bills existance and associated to the given vendor.
    await this.validators.validateBillsExistance(
      billPaymentObj.entries,
      billPaymentDTO.vendorId,
    );
    // Validates the bills due payment amount.
    await this.validators.validateBillsDueAmount(
      billPaymentObj.entries,
      oldBillPayment.entries,
    );
    // Validate the payment number uniquiness.
    if (billPaymentObj.paymentNumber) {
      await this.validators.validatePaymentNumber(
        billPaymentObj.paymentNumber,
        billPaymentId,
      );
    }
    // Validates the withdrawal account currency code.
    this.validators.validateWithdrawalAccountCurrency(
      paymentAccount.currencyCode,
      vendor.currencyCode,
      tenantMeta.metadata.baseCurrency,
    );
    // Edits the bill transactions with associated transactions
    // under unit-of-work envirement.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onBillPaymentEditing` event.
      await this.eventPublisher.emitAsync(events.billPayment.onEditing, {
        oldBillPayment,
        billPaymentDTO,
        trx,
      } as IBillPaymentEditingPayload);

      // Edits the bill payment transaction graph on the storage.
      await this.billPaymentModel()
        .query(trx)
        .upsertGraph({
          id: billPaymentId,
          ...billPaymentObj,
        });

      // Fetch the bill payment with entries to ensure they're loaded for the subscriber.
      const billPayment = await this.billPaymentModel()
        .query(trx)
        .withGraphFetched('entries')
        .findById(billPaymentId)
        .throwIfNotFound();

      // Triggers `onBillPaymentEdited` event.
      await this.eventPublisher.emitAsync(events.billPayment.onEdited, {
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
