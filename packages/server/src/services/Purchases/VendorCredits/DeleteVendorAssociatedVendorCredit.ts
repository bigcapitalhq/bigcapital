import { Inject, Service } from 'typedi';
import { ServiceError } from '@/exceptions';
import TenancyService from '@/services/Tenancy/TenancyService';
import events from '@/subscribers/events';
import { IVendorEventDeletingPayload } from '@/interfaces';

const ERRORS = {
  VENDOR_HAS_TRANSACTIONS: 'VENDOR_HAS_TRANSACTIONS',
};

@Service()
export default class DeleteVendorAssociatedVendorCredit {
  @Inject()
  tenancy: TenancyService;

  /**
   * Attaches events with handlers.
   * @param bus
   */
  public attach = (bus) => {
    bus.subscribe(
      events.vendors.onDeleting,
      this.validateVendorHasNoCreditsTransactionsOnceDeleting
    );
  };

  /**
   * Validate vendor has no associated credit transaction once the vendor deleting.
   * @param {IVendorEventDeletingPayload} payload -
   */
  public validateVendorHasNoCreditsTransactionsOnceDeleting = async ({
    tenantId,
    vendorId,
  }: IVendorEventDeletingPayload) => {
    await this.validateVendorHasNoCreditsTransactions(tenantId, vendorId);
  };

  /**
   * Validate the given vendor has no associated vendor credit transactions.
   * @param {number} tenantId
   * @param {number} vendorId
   */
  public validateVendorHasNoCreditsTransactions = async (
    tenantId: number,
    vendorId: number
  ): Promise<void> => {
    const { VendorCredit } = this.tenancy.models(tenantId);

    const associatedVendors = await VendorCredit.query().where(
      'vendorId',
      vendorId
    );
    if (associatedVendors.length > 0) {
      throw new ServiceError(ERRORS.VENDOR_HAS_TRANSACTIONS);
    }
  };
}
