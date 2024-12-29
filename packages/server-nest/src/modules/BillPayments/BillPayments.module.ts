import { Module } from '@nestjs/common';
import { BillPaymentsApplication } from './BillPaymentsApplication.service';
import { CreateBillPaymentService } from './commands/CreateBillPayment.service';
import { EditBillPayment } from './commands/EditBillPayment.service';
import { GetBillPayment } from './queries/GetBillPayment.service';
import { DeleteBillPayment } from './commands/DeleteBillPayment.service';
import { BillPaymentBillSync } from './commands/BillPaymentBillSync.service';
import { GetPaymentBills } from './queries/GetPaymentBills.service';
import { BillPaymentValidators } from './commands/BillPaymentValidators.service';
import { CommandBillPaymentDTOTransformer } from './commands/CommandBillPaymentDTOTransformer.service';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { BranchTransactionDTOTransformer } from '../Branches/integrations/BranchTransactionDTOTransform';
import { BranchesSettingsService } from '../Branches/BranchesSettings';

@Module({
  providers: [
    BillPaymentsApplication,
    CreateBillPaymentService,
    EditBillPayment,
    GetBillPayment,
    DeleteBillPayment,
    BillPaymentBillSync,
    GetPaymentBills,
    BillPaymentValidators,
    CommandBillPaymentDTOTransformer,
    BranchTransactionDTOTransformer,
    BranchesSettingsService,
    TenancyContext,
  ],
  exports: [BillPaymentValidators],
  controllers: [],
})
export class BillPaymentsModule {}
