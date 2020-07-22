import { omit } from "lodash";
import { BillPayment } from '@/models';

export default class BillPaymentsService { 

  static async createBillPayment(billPayment) {
    const storedBillPayment = await BillPayment.tenant().query().insert({
      ...omit(billPayment, ['entries']),
    });

  }

  editBillPayment(billPaymentId, billPayment)  {

  }

  static async isBillPaymentExists(billPaymentId) {
    const foundBillPayments = await BillPayment.tenant().query().where('id', billPaymentId);
    return foundBillPayments.lengh > 0;
  }

  static async isBillPaymentNumberExists(billPaymentNumber) {
    const foundPayments = await Bill.tenant().query().where('bill_payment_number', billPaymentNumber);
    return foundPayments.length > 0;
  }

  isBillPaymentsExist(billPaymentIds) {
    
  }
}