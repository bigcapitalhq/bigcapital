import { IVendorCreditApplyToBillDeletedPayload, IVendorCreditApplyToBillsCreatedPayload } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import events from '@/subscribers/events';
import { sumBy } from 'lodash';
import { Inject, Service } from 'typedi';
import ApplyVendorCreditSyncInvoiced from './ApplyVendorCreditSyncInvoiced';

@Service()
export default class ApplyVendorCreditSyncInvoicedSubscriber {
  @Inject()
  tenancy: HasTenancyService;

  @Inject()
  syncCreditWithInvoiced: ApplyVendorCreditSyncInvoiced;

  /**
   * Attaches events with handlers.
   */
  attach(bus) {
    bus.subscribe(events.vendorCredit.onApplyToInvoicesCreated, this.incrementBillInvoicedOnceCreditApplied);
    bus.subscribe(events.vendorCredit.onApplyToInvoicesDeleted, this.decrementBillInvoicedOnceCreditApplyDeleted);
  }

  /**
   * Increment vendor credit invoiced amount once the apply transaction created.
   * @param {IVendorCreditApplyToBillsCreatedPayload} payload -
   */
  private incrementBillInvoicedOnceCreditApplied = async ({
    vendorCredit,
    tenantId,
    vendorCreditAppliedBills,
    trx,
  }: IVendorCreditApplyToBillsCreatedPayload) => {
    const amount = sumBy(vendorCreditAppliedBills, 'amount');

    await this.syncCreditWithInvoiced.incrementVendorCreditInvoicedAmount(tenantId, vendorCredit.id, amount, trx);
  };

  /**
   * Decrement vendor credit invoiced amount once the apply transaction deleted.
   * @param {IVendorCreditApplyToBillDeletedPayload} payload -
   */
  private decrementBillInvoicedOnceCreditApplyDeleted = async ({
    tenantId,
    vendorCredit,
    oldCreditAppliedToBill,
    trx,
  }: IVendorCreditApplyToBillDeletedPayload) => {
    await this.syncCreditWithInvoiced.decrementVendorCreditInvoicedAmount(
      tenantId,
      oldCreditAppliedToBill.vendorCreditId,
      oldCreditAppliedToBill.amount,
      trx,
    );
  };
}
