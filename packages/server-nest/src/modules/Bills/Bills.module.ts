import { Module } from '@nestjs/common';
import { BillsApplication } from './Bills.application';
import { CreateBill } from './commands/CreateBill.service';
import { DeleteBill } from './commands/DeleteBill.service';
import { GetBill } from './queries/GetBill';
import { BillDTOTransformer } from './commands/BillDTOTransformer.service';

@Module({
  providers: [
    BillsApplication,
    CreateBill,
    GetBill,
    DeleteBill,
    BillDTOTransformer,
  ],
})
export class BillsModule {}
