import TenantRepository from "./TenantRepository";
import { Customer } from 'models'
export default class CustomerRepository extends TenantRepository {
  /**
   * Constructor method.
   */
  constructor(knex, cache) {
    super(knex, cache);
    this.model = Customer;
  }

  changeBalance(vendorId: number, amount: number) {
    return super.changeNumber({ id: vendorId }, 'balance', amount);
  }

  async changeDiffBalance(
    vendorId: number,
    amount: number,
    oldAmount: number,
    oldVendorId?: number,
  ) {
    const diffAmount = amount - oldAmount;
    const asyncOpers = [];
    const _oldVendorId = oldVendorId || vendorId;

    if (vendorId != _oldVendorId) {
      const oldCustomerOper = this.changeBalance(_oldVendorId, (oldAmount * -1));
      const customerOper = this.changeBalance(vendorId, amount);

      asyncOpers.push(customerOper);
      asyncOpers.push(oldCustomerOper);
    } else {
      const balanceChangeOper = this.changeBalance(vendorId, diffAmount);
      asyncOpers.push(balanceChangeOper);
    }
    await Promise.all(asyncOpers);
  }
}