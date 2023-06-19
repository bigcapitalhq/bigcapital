import { Service, Inject } from 'typedi';
import Knex from 'knex';
import { sumBy } from 'lodash';
import {
  IVendorCredit,
  IVendorCreditApplyToBillsCreatedPayload,
  IVendorCreditApplyToInvoicesDTO,
  IVendorCreditApplyToInvoicesModel,
  IBill,
} from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import PaymentReceiveService from '@/services/Sales/PaymentReceives/PaymentsReceives';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import VendorCredit from '../BaseVendorCredit';
import BillPaymentsService from '@/services/Purchases/BillPayments/BillPayments';
import { ServiceError } from '@/exceptions';
import { ERRORS } from '../constants';

@Service()
export default class ApplyVendorCreditToBills extends VendorCredit {
  @Inject('PaymentReceives')
  paymentReceive: PaymentReceiveService;

  @Inject()
  uow: UnitOfWork;

  @Inject()
  eventPublisher: EventPublisher;

  @Inject()
  billPayment: BillPaymentsService;

  /**
   * Apply credit note to the given invoices.
   * @param {number} tenantId
   * @param {number} creditNoteId
   * @param {IApplyCreditToInvoicesDTO} applyCreditToInvoicesDTO
   */
  public applyVendorCreditToBills = async (
    tenantId: number,
    vendorCreditId: number,
    applyCreditToBillsDTO: IVendorCreditApplyToInvoicesDTO
  ): Promise<void> => {
    const { VendorCreditAppliedBill } = this.tenancy.models(tenantId);

    // Retrieves the vendor credit or throw not found service error.
    const vendorCredit = await this.getVendorCreditOrThrowError(
      tenantId,
      vendorCreditId
    );
    // Transformers credit apply to bills DTO to model object.
    const vendorCreditAppliedModel = this.transformApplyDTOToModel(
      applyCreditToBillsDTO,
      vendorCredit
    );
    // Validate bills entries existence.
    const appliedBills = await this.billPayment.validateBillsExistence(
      tenantId,
      vendorCreditAppliedModel.entries,
      vendorCredit.vendorId
    );
    // Validate bills has remaining amount to apply.
    this.validateBillsRemainingAmount(
      appliedBills,
      vendorCreditAppliedModel.amount
    );
    // Validate vendor credit remaining credit amount.
    this.validateCreditRemainingAmount(
      vendorCredit,
      vendorCreditAppliedModel.amount
    );
    // Saves vendor credit applied to bills under unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Inserts vendor credit applied to bills graph to the storage layer.
      const vendorCreditAppliedBills =
        await VendorCreditAppliedBill.query().insertGraph(
          vendorCreditAppliedModel.entries
        );
      // Triggers `IVendorCreditApplyToBillsCreatedPayload` event.
      await this.eventPublisher.emitAsync(
        events.vendorCredit.onApplyToInvoicesCreated,
        {
          trx,
          tenantId,
          vendorCredit,
          vendorCreditAppliedBills,
        } as IVendorCreditApplyToBillsCreatedPayload
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
    vendorCredit: IVendorCredit
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
  private validateBillsRemainingAmount = (bills: IBill[], amount: number) => {
    const invalidBills = bills.filter((bill) => bill.dueAmount < amount);
    if (invalidBills.length > 0) {
      throw new ServiceError(ERRORS.BILLS_HAS_NO_REMAINING_AMOUNT);
    }
  };
}
