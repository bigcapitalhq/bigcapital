import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from 'utils';

export class VendorCreditAppliedBillTransformer extends Transformer {
  /**
   * Included attributes.
   * @returns {string[]}
   */
  public includeAttributes = (): string[] => {
    return [
      'formattedAmount',
      'vendorCreditNumber',
      'vendorCreditDate',
      'billNumber',
      'billReferenceNo',
      'formattedVendorCreditDate',
      'formattedBillDate',
    ];
  };

  /**
   * Exclude attributes.
   * @returns {string[]}
   */
  public excludeAttributes = (): string[] => {
    return ['bill', 'vendorCredit'];
  };

  protected formattedAmount = (item) => {
    return formatNumber(item.amount, {
      currencyCode: item.vendorCredit.currencyCode,
    });
  };

  protected vendorCreditNumber = (item) => {
    return item.vendorCredit.vendorCreditNumber;
  };

  protected vendorCreditDate = (item) => {
    return item.vendorCredit.vendorCreditDate;
  };

  protected formattedVendorCreditDate = (item) => {
    return this.formatDate(item.vendorCredit.vendorCreditDate);
  };

  protected billNumber = (item) => {
    return item.bill.billNo;
  };

  protected billReferenceNo = (item) => {
    return item.bill.referenceNo;
  };

  protected BillDate = (item) => {
    return item.bill.billDate;
  };

  protected formattedBillDate = (item) => {
    return this.formatDate(item.bill.billDate);
  };
}
