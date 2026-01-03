import { Knex } from 'knex';
import {
  IBillPaymentEventCreatedPayload,
  IBillPaymentCreatingPayload,
} from '../types/BillPayments.types';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '../../Tenancy/TenancyDB/UnitOfWork.service';
import { BillPaymentValidators } from './BillPaymentValidators.service';
import { CommandBillPaymentDTOTransformer } from './CommandBillPaymentDTOTransformer.service';
import { events } from '@/common/events/events';
import { TenancyContext } from '../../Tenancy/TenancyContext.service';
import { BillPayment } from '../models/BillPayment';
import { Vendor } from '../../Vendors/models/Vendor';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { CreateBillPaymentDto } from '../dtos/BillPayment.dto';

@Injectable()
export class CreateBillPaymentService {
  /**
   * @param {UnitOfWork} uow - Unit of work service.
   * @param {EventEmitter2} eventPublisher - Event emitter service.
   * @param {BillPaymentValidators} validators - Bill payment validators service.
   * @param {CommandBillPaymentDTOTransformer} commandTransformerDTO - Command bill payment DTO transformer service.
   * @param {TenancyContext} tenancyContext - Tenancy context service.
   * @param {TenantModelProxy<typeof Vendor>} vendorModel - Vendor model.
   * @param {TenantModelProxy<typeof BillPayment>} billPaymentModel - Bill payment model.
   */
  constructor(
    private uow: UnitOfWork,
    private eventPublisher: EventEmitter2,
    private validators: BillPaymentValidators,
    private commandTransformerDTO: CommandBillPaymentDTOTransformer,
    private tenancyContext: TenancyContext,

    @Inject(Vendor.name)
    private readonly vendorModel: TenantModelProxy<typeof Vendor>,

    @Inject(BillPayment.name)
    private readonly billPaymentModel: TenantModelProxy<typeof BillPayment>,
  ) { }

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
    billPaymentDTO: CreateBillPaymentDto,
    trx?: Knex.Transaction,
  ): Promise<BillPayment> {
    const tenantMeta = await this.tenancyContext.getTenant(true);

    // Retrieves the payment vendor or throw not found error.
    const vendor = await this.vendorModel()
      .query()
      .findById(billPaymentDTO.vendorId)
      .throwIfNotFound();

    // Transform create DTO to model object.
    const billPaymentObj = await this.commandTransformerDTO.transformDTOToModel(
      billPaymentDTO,
      vendor,
    );
    // Validate the payment account existance and type.
    const paymentAccount = await this.validators.getPaymentAccountOrThrowError(
      billPaymentObj.paymentAccountId,
    );
    // Validate the payment number uniquiness.
    if (billPaymentObj.paymentNumber) {
      await this.validators.validatePaymentNumber(billPaymentObj.paymentNumber);
    }
    // Validates the bills existance and associated to the given vendor.
    await this.validators.validateBillsExistance(
      billPaymentObj.entries,
      billPaymentDTO.vendorId,
    );
    // Validates the bills due payment amount.
    await this.validators.validateBillsDueAmount(billPaymentObj.entries);
    // Validates the withdrawal account currency code.
    this.validators.validateWithdrawalAccountCurrency(
      paymentAccount.currencyCode,
      vendor.currencyCode,
      tenantMeta.metadata.baseCurrency,
    );
    // Writes bill payment transacation with associated transactions
    // under unit-of-work envirement.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onBillPaymentCreating` event.
      await this.eventPublisher.emitAsync(events.billPayment.onCreating, {
        billPaymentDTO,
        trx,
      } as IBillPaymentCreatingPayload);

      // Writes the bill payment graph to the storage.
      const insertedBillPayment = await this.billPaymentModel()
        .query(trx)
        .insertGraphAndFetch({
          ...billPaymentObj,
        });

      // Fetch the bill payment with entries to ensure they're loaded for the subscriber.
      const billPayment = await this.billPaymentModel()
        .query(trx)
        .withGraphFetched('entries')
        .findById(insertedBillPayment.id)
        .throwIfNotFound();

      // Triggers `onBillPaymentCreated` event.
      await this.eventPublisher.emitAsync(events.billPayment.onCreated, {
        billPayment,
        billPaymentId: billPayment.id,
        billPaymentDTO,
        trx,
      } as IBillPaymentEventCreatedPayload);

      return billPayment;
    }, trx);
  }
}
