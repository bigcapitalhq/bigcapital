import { Container } from 'typedi';
import VoucherService from '@/services/Payment/Voucher';

export default class SendVoucherViaEmailJob {
  public async handler(job, done: Function): Promise<void> {
    const Logger = Container.get('logger');
    const voucherService = Container.get(VoucherService);
    const { email, voucherCode } = job.attrs.data;

    Logger.debug(`Send voucher via email - started: ${job.attrs.data}`);

    try {
      await voucherService.mailMessages.sendMailVoucher(voucherCode, email);
      Logger.debug(`Send voucher via email - completed: ${job.attrs.data}`);
      done();
    } catch(e) {
      console.log(e);
      Logger.error(`Send voucher via email: ${job.attrs.data}, error: ${e}`);
      done(e);  
    } 
  }
}
