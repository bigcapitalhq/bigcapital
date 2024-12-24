import { Module } from '@nestjs/common';
import { BillPaymentsApplication } from './BillPaymentsApplication.service';
import { CreateBillPaymentService } from './commands/CreateBillPayment.service';
import { EditBillPayment } from './commands/EditBillPayment.service';
import { GetBillPayment } from './queries/GetBillPayment.service';
import { DeleteBillPayment } from './commands/DeleteBillPayment.service';

@Module({
  providers: [
    BillPaymentsApplication,
    CreateBillPaymentService,
    EditBillPayment,
    GetBillPayment,
    DeleteBillPayment,
  ],
  controllers: [],
})
export class BillPaymentsModule {}
