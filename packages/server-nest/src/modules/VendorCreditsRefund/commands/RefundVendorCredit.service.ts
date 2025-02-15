import { Inject, Injectable } from '@nestjs/common';
import { ERRORS } from '../constants';
import { Account } from '@/modules/Accounts/models/Account.model';
import { RefundVendorCredit } from '../models/RefundVendorCredit';
import { VendorCredit } from '@/modules/VendorCredit/models/VendorCredit';
import { ServiceError } from '@/modules/Items/ServiceError';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class RefundVendorCreditService {
  constructor(
    @Inject(RefundVendorCredit.name)
    private refundVendorCreditModel: TenantModelProxy<
      typeof RefundVendorCredit
    >,

    @Inject(Account.name)
    private accountModel: TenantModelProxy<typeof Account>,

    @Inject(VendorCredit.name)
    private vendorCreditModel: TenantModelProxy<typeof VendorCredit>,
  ) {}

  /**
   * Retrieve the vendor credit refund or throw not found service error.
   * @param {number} refundVendorCreditId
   * @returns {Promise<RefundVendorCredit}
   */
  public getRefundVendorCreditOrThrowError = async (
    refundVendorCreditId: number,
  ) => {
    const refundCredit = await this.refundVendorCreditModel()
      .query()
      .findById(refundVendorCreditId);
    if (!refundCredit) {
      throw new ServiceError(ERRORS.REFUND_VENDOR_CREDIT_NOT_FOUND);
    }
    return refundCredit;
  };

  /**
   * Validate the deposit refund account type.
   * @param {Account} account
   */
  public validateRefundDepositAccountType = (account: Account): void => {
    const supportedTypes = ['bank', 'cash', 'fixed-asset'];

    if (supportedTypes.indexOf(account.accountType) === -1) {
      throw new ServiceError(ERRORS.DEPOSIT_ACCOUNT_INVALID_TYPE);
    }
  };

  /**
   * Validate vendor credit has remaining credits.
   * @param {VendorCredit} vendorCredit
   * @param {number} amount
   */
  public validateVendorCreditRemainingCredit = (
    vendorCredit: VendorCredit,
    amount: number,
  ) => {
    if (vendorCredit.creditsRemaining < amount) {
      throw new ServiceError(ERRORS.VENDOR_CREDIT_HAS_NO_CREDITS_REMAINING);
    }
  };
}
