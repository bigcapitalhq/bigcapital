import { Customer } from '@/models';

export default class CustomerRepository {

  static changeDiffBalance(customerId, oldCustomerId, amount, oldAmount) {
    const diffAmount = (amount - oldAmount) * -1;
    const asyncOpers = [];

    if (customerId != oldCustomerId) {
      const oldCustomerOper = Customer.changeBalance(
        oldCustomerId,
        oldAmount
      );
      const customerOper = Customer.changeBalance(
        customerId,
        (amount + diffAmount) * -1
      );
      asyncOpers.push(customerOper);
      asyncOpers.push(oldCustomerOper);
    } else {
      const balanceChangeOper = Customer.changeBalance(customerId, diffAmount);
      asyncOpers.push(balanceChangeOper);
    }
    return Promise.all(asyncOpers);
  }
}
