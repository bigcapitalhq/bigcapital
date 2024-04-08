import { IVendorCreditApplyToBillDeletedPayload, IVendorCreditApplyToBillsCreatedPayload } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import events from '@/subscribers/events';
import { Inject, Service } from 'typedi';
import ApplyVendorCreditSyncBills from './ApplyVendorCreditSyncBills';

@Service()
export default class ApplyVendorCreditSyncBillsSubscriber {
  @Inject()
  tenancy: HasTenancyService;

  @Inject()
  syncBillsWithVendorCredit: ApplyVendorCreditSyncBills;

  /**
   * Attaches events with handlers.
   */
  attach(bus) {
    bus.subscribe(events.vendorCredit.onApplyToInvoicesCreated, this.incrementAppliedBillsOnceCreditCreated);
    bus.subscribe(events.vendorCredit.onApplyToInvoicesDeleted, this.decrementAppliedBillsOnceCreditDeleted);
  }

  /**
   * Increment credited amount of applied bills once the vendor credit
   * transaction created.
   * @param {IVendorCreditApplyToBillsCreatedPayload}  paylaod -
   */
  private incrementAppliedBillsOnceCreditCreated = async ({
    tenantId,
    vendorCreditAppliedBills,
    trx,
  }: IVendorCreditApplyToBillsCreatedPayload) => {
    await this.syncBillsWithVendorCredit.incrementBillsCreditedAmount(tenantId, vendorCreditAppliedBills, trx);
  };

  /**
   * Decrement credited amount of applied bills once the vendor credit
   * transaction delted.
   * @param {IVendorCreditApplyToBillDeletedPayload} payload
   */
  private decrementAppliedBillsOnceCreditDeleted = async ({
    oldCreditAppliedToBill,
    tenantId,
    trx,
  }: IVendorCreditApplyToBillDeletedPayload) => {
    await this.syncBillsWithVendorCredit.decrementBillCreditedAmount(tenantId, oldCreditAppliedToBill, trx);
  };
}
