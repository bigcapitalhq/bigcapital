import Customer from "../../models/Customer";


export default class CustomersService {

  static async isCustomerExists(customerId) {
    const foundCustomeres = await Customer.tenant().query().where('id', customerId);
    return foundCustomeres.length > 0;
  }
}