import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { sumBy } from 'lodash';
import {
  IVendorCreditApplyToBillsCreatedPayload,
  IVendorCreditApplyToInvoicesDTO,
  IVendorCreditApplyToInvoicesModel,
} from '../types/VendorCreditApplyBills.types';
import { ERRORS } from '../VendorCreditsApplyBills.constants';
import { VendorCreditAppliedBill } from '../models/VendorCreditAppliedBill';
import { VendorCredit } from '@/modules/VendorCredit/models/VendorCredit';
import { BillPaymentValidators } from '@/modules/BillPayments/commands/BillPaymentValidators.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { Bill } from '@/modules/Bills/models/Bill';
import { ServiceError } from '@/modules/Items/ServiceError';

@Injectable()
export class ApplyVendorCreditToBillsService {
  /**
   * @param {UnitOfWork} uow - The unit of work service.
   * @param {EventEmitter2} eventPublisher - The event emitter service.
   * @param {BillPaymentValidators} billPaymentValidators - The bill payment validators service.
   * @param {typeof VendorCreditAppliedBill} vendorCreditAppliedBillModel - The vendor credit applied bill model.
   * @param {typeof VendorCredit} vendorCreditModel - The vendor credit model.
   */
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,
    private readonly billPaymentValidators: BillPaymentValidators,
    private readonly vendorCreditAppliedBillModel: typeof VendorCreditAppliedBill,

    @Inject(VendorCredit.name)
    private readonly vendorCreditModel: typeof VendorCredit,
  ) {}

  /**
   * Apply credit note to the given invoices.
   * @param {number} creditNoteId
   * @param {IApplyCreditToInvoicesDTO} applyCreditToInvoicesDTO
   */
  public applyVendorCreditToBills = async (
    vendorCreditId: number,
    applyCreditToBillsDTO: IVendorCreditApplyToInvoicesDTO,
  ): Promise<void> => {
    // Retrieves the vendor credit or throw not found service error.
    const vendorCredit = await this.vendorCreditModel
      .query()
      .findById(vendorCreditId)
      .throwIfNotFound();

    // Transfomes credit apply to bills DTO to model object.
    const vendorCreditAppliedModel = this.transformApplyDTOToModel(
      applyCreditToBillsDTO,
      vendorCredit,
    );

    // Validate bills entries existance.
    const appliedBills =
      await this.billPaymentValidators.validateBillsExistance(
        vendorCreditAppliedModel.entries,
        vendorCredit.vendorId,
      );

    // Validate bills has remaining amount to apply.
    this.validateBillsRemainingAmount(
      appliedBills,
      vendorCreditAppliedModel.amount,
    );
    // Validate vendor credit remaining credit amount.
    this.validateCreditRemainingAmount(
      vendorCredit,
      vendorCreditAppliedModel.amount,
    );

    // Saves vendor credit applied to bills under unit-of-work envirement.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Inserts vendor credit applied to bills graph to the storage layer.
      const vendorCreditAppliedBills = await this.vendorCreditAppliedBillModel
        .query(trx)
        .insertGraph(vendorCreditAppliedModel.entries);

      // Triggers `IVendorCreditApplyToBillsCreatedPayload` event.
      await this.eventPublisher.emitAsync(
        events.vendorCredit.onApplyToInvoicesCreated,
        {
          trx,
          vendorCredit,
          vendorCreditAppliedBills,
        } as IVendorCreditApplyToBillsCreatedPayload,
      );
    });
  };

  /**
   * Transformes apply DTO to model.
   * @param {IApplyCreditToInvoicesDTO} applyDTO
   * @param {ICreditNote} creditNote
   * @returns {IVendorCreditApplyToInvoicesModel}
   */
  private transformApplyDTOToModel = (
    applyDTO: IVendorCreditApplyToInvoicesDTO,
    vendorCredit: VendorCredit,
  ): IVendorCreditApplyToInvoicesModel => {
    const entries = applyDTO.entries.map((entry) => ({
      billId: entry.billId,
      amount: entry.amount,
      vendorCreditId: vendorCredit.id,
    }));
    const amount = sumBy(applyDTO.entries, 'amount');

    return {
      amount,
      entries,
    };
  };

  /**
   * Validate bills remaining amount.
   * @param {IBill[]} bills
   * @param {number} amount
   */
  private validateBillsRemainingAmount = (bills: Bill[], amount: number) => {
    const invalidBills = bills.filter((bill) => bill.dueAmount < amount);
    if (invalidBills.length > 0) {
      throw new ServiceError(ERRORS.BILLS_HAS_NO_REMAINING_AMOUNT);
    }
  };
}
