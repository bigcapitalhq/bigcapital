import { Customer } from 'models';

export default class CustomerRepository {

  static changeDiffBalance(customerId, oldCustomerId, amount, oldAmount) {
    const diffAmount = amount - oldAmount;
    const asyncOpers = [];

    if (customerId != oldCustomerId) {
      const oldCustomerOper = Customer.changeBalance(
        oldCustomerId,
        (oldAmount * -1)
      );
      const customerOper = Customer.changeBalance(
        customerId,
        amount, 
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
