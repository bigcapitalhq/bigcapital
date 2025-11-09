import { Module } from '@nestjs/common';
import { ApplyVendorCreditSyncBillsService } from './command/ApplyVendorCreditSyncBills.service';
import { ApplyVendorCreditSyncInvoicedService } from './command/ApplyVendorCreditSyncInvoiced.service';
import { DeleteApplyVendorCreditToBillService } from './command/DeleteApplyVendorCreditToBill.service';
import { ApplyVendorCreditToBillsService } from './command/ApplyVendorCreditToBills.service';
import { GetAppliedBillsToVendorCreditService } from './queries/GetAppliedBillsToVendorCredit.service';
import { GetVendorCreditToApplyBills } from './queries/GetVendorCreditToApplyBills.service';
import { VendorCreditApplyBillsApplicationService } from './VendorCreditApplyBillsApplication.service';
import { VendorCreditApplyBillsController } from './VendorCreditApplyBills.controller';
import { BillsModule } from '../Bills/Bills.module';
import { BillPaymentsModule } from '../BillPayments/BillPayments.module';
import { VendorCreditDTOTransformService } from '../VendorCredit/commands/VendorCreditDTOTransform.service';
import { ItemsModule } from '../Items/Items.module';
import { BranchesModule } from '../Branches/Branches.module';
import { WarehousesModule } from '../Warehouses/Warehouses.module';
import { VendorCreditsModule } from '../VendorCredit/VendorCredits.module';

@Module({
  imports: [
    BillsModule,
    BillPaymentsModule,
    ItemsModule,
    BranchesModule,
    WarehousesModule,
    VendorCreditsModule
  ],
  providers: [
    ApplyVendorCreditSyncBillsService,
    ApplyVendorCreditSyncInvoicedService,
    ApplyVendorCreditToBillsService,
    DeleteApplyVendorCreditToBillService,
    GetAppliedBillsToVendorCreditService,
    GetVendorCreditToApplyBills,
    VendorCreditApplyBillsApplicationService,
  ],
  controllers: [VendorCreditApplyBillsController],
})
export class VendorCreditApplyBillsModule { }
