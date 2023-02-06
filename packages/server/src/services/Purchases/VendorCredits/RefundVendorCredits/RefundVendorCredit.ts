import { ServiceError } from '@/exceptions';
import { IAccount, IVendorCredit } from '@/interfaces';
import { Service, Inject } from 'typedi';
import BaseVendorCredit from '../BaseVendorCredit';
import { ERRORS } from './constants';

@Service()
export default class RefundVendorCredit extends BaseVendorCredit {
  /**
   * Retrieve the vendor credit refund or throw not found service error.
   * @param {number} tenantId
   * @param {number} vendorCreditId
   * @returns
   */
  public getRefundVendorCreditOrThrowError = async (
    tenantId: number,
    refundVendorCreditId: number
  ) => {
    const { RefundVendorCredit } = this.tenancy.models(tenantId);

    const refundCredit = await RefundVendorCredit.query().findById(
      refundVendorCreditId
    );
    if (!refundCredit) {
      throw new ServiceError(ERRORS.REFUND_VENDOR_CREDIT_NOT_FOUND);
    }
    return refundCredit;
  };

  /**
   * Validate the deposit refund account type.
   * @param {IAccount} account
   */
  public validateRefundDepositAccountType = (account: IAccount): void => {
    const supportedTypes = ['bank', 'cash', 'fixed-asset'];

    if (supportedTypes.indexOf(account.accountType) === -1) {
      throw new ServiceError(ERRORS.DEPOSIT_ACCOUNT_INVALID_TYPE);
    }
  };

  /**
   * Validate vendor credit has remaining credits.
   * @param {IVendorCredit} vendorCredit
   * @param {number} amount
   */
  public validateVendorCreditRemainingCredit = (
    vendorCredit: IVendorCredit,
    amount: number
  ) => {
    if (vendorCredit.creditsRemaining < amount) {
      throw new ServiceError(ERRORS.VENDOR_CREDIT_HAS_NO_CREDITS_REMAINING);
    }
  };
}
