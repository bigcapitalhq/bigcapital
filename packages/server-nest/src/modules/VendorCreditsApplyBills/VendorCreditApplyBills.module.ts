

import { Module } from "@nestjs/common";
import { ApplyVendorCreditSyncBillsService } from "./command/ApplyVendorCreditSyncBills.service";
import { ApplyVendorCreditSyncInvoicedService } from "./command/ApplyVendorCreditSyncInvoiced.service";
import { DeleteApplyVendorCreditToBillService } from "./command/DeleteApplyVendorCreditToBill.service";
import { ApplyVendorCreditToBillsService } from "./command/ApplyVendorCreditToBills.service";
import { GetAppliedBillsToVendorCreditService } from "./queries/GetAppliedBillsToVendorCredit.service";

@Module({
  imports: [
    ApplyVendorCreditSyncBillsService,
    ApplyVendorCreditSyncInvoicedService,
    ApplyVendorCreditToBillsService,
    DeleteApplyVendorCreditToBillService,
    GetAppliedBillsToVendorCreditService
  ],
  controllers: [],
})
export class VendorCreditApplyBillsModule {}
