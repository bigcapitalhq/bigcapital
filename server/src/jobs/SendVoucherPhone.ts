import { Container } from 'typedi';
import VoucherService from '@/services/Payment/Voucher';

export default class SendVoucherViaPhoneJob {
  public async handler(job, done: Function): Promise<void> {
    const Logger = Container.get('logger');
    const voucherService = Container.get(VoucherService);
    const { phoneNumber, voucherCode } = job.attrs.data;

    Logger.debug(`Send voucher via phone number - started: ${job.attrs.data}`);

    try {
      await voucherService.smsMessages.sendVoucherSMSMessage(phoneNumber, voucherCode);
      Logger.debug(`Send voucher via phone number - completed: ${job.attrs.data}`);
      done();
    } catch(e) {
      console.log(e);
      Logger.error(`Send voucher via phone number: ${job.attrs.data}, error: ${e}`);
      done(e);  
    }
  }
}
