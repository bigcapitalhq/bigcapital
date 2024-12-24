import { Module } from '@nestjs/common';
import { SaleReceiptApplication } from './SaleReceiptApplication.service';
import { CreateSaleReceipt } from './commands/CreateSaleReceipt.service';
import { EditSaleReceipt } from './commands/EditSaleReceipt.service';
import { GetSaleReceipt } from './queries/GetSaleReceipt.service';
import { DeleteSaleReceipt } from './commands/DeleteSaleReceipt.service';
import { CloseSaleReceipt } from './commands/CloseSaleReceipt.service';

@Module({
  providers: [
    SaleReceiptApplication,
    CreateSaleReceipt,
    EditSaleReceipt,
    GetSaleReceipt,
    DeleteSaleReceipt,
    CloseSaleReceipt,
  ],
})
export class SaleReceiptsModule {}
