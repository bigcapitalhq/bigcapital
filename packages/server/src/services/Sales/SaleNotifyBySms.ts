import { ServiceError } from '@/exceptions';
import parsePhoneNumber from 'libphonenumber-js';
import { Service } from 'typedi';

const ERRORS = {
  CUSTOMER_HAS_NO_PHONE_NUMBER: 'CUSTOMER_HAS_NO_PHONE_NUMBER',
  CUSTOMER_SMS_NOTIFY_PHONE_INVALID: 'CUSTOMER_SMS_NOTIFY_PHONE_INVALID',
};

@Service()
export default class SaleNotifyBySms {
  /**
   * Validate the customer phone number.
   * @param {ICustomer} customer
   */
  public validateCustomerPhoneNumber = (personalPhone: string) => {
    if (!personalPhone) {
      throw new ServiceError(ERRORS.CUSTOMER_HAS_NO_PHONE_NUMBER);
    }
    this.validateCustomerPhoneNumberLocally(personalPhone);
  };

  /**
   *
   * @param {string} personalPhone
   */
  public validateCustomerPhoneNumberLocally = (personalPhone: string) => {
    const phoneNumber = parsePhoneNumber(personalPhone, 'LY');

    if (!phoneNumber || !phoneNumber.isValid()) {
      throw new ServiceError(ERRORS.CUSTOMER_SMS_NOTIFY_PHONE_INVALID);
    }
  };
}
