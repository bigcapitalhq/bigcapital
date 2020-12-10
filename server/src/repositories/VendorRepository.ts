import { IVendor } from "interfaces";
import TenantRepository from "./TenantRepository";


export default class VendorRepository extends TenantRepository {

  /**
   * Retrieve vendor details of the given id.
   * @param {number} vendorId - Vendor id.
   */
  findById(vendorId: number) {
    const { Contact } = this.models;
    return Contact.query().findById(vendorId);
  }

  /**
   * Retrieve the bill that associated to the given vendor id.
   * @param {number} vendorId - Vendor id.
   */
  getBills(vendorId: number) {
    const { Bill } = this.models;

    return this.cache.get(`vendors.bills.${vendorId}`, () => {
      return Bill.query().where('vendor_id', vendorId);
    });
  }

  /**
   * Retrieve all the given vendors.
   * @param {numner[]} vendorsIds 
   * @return {IVendor}
   */
  vendors(vendorsIds: number[]): IVendor[] {
    const { Contact } = this.models;
    return Contact.query().modifier('vendor').whereIn('id', vendorsIds);
  }

  /**
   * Retrieve vendors with associated bills.
   * @param {number[]} vendorIds 
   */
  vendorsWithBills(vendorIds: number[]) {
    const { Contact } = this.models;
    return Contact.query().modify('vendor')
      .whereIn('id', vendorIds)
      .withGraphFetched('bills');
  }

  changeBalance(vendorId: number, amount: number) {
    const { Contact } = this.models;
    const changeMethod = (amount > 0) ? 'increment' : 'decrement';

    return Contact.query()
      .where('id', vendorId)
      [changeMethod]('balance', Math.abs(amount));
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
