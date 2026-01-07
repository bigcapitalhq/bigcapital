import { Module } from '@nestjs/common';
import { GetRefundVendorCreditsService } from './queries/GetRefundVendorCredits.service';
import { DeleteRefundVendorCreditService } from './commands/DeleteRefundVendorCredit.service';
import { VendorCreditsRefundController } from './VendorCreditsRefund.controller';
import { VendorCreditsRefundApplication } from './VendorCreditsRefund.application';
import { CreateRefundVendorCredit } from './commands/CreateRefundVendorCredit.service';
import { WarehousesModule } from '../Warehouses/Warehouses.module';
import { BranchesModule } from '../Branches/Branches.module';
import { RefundVendorCreditGLEntries } from './commands/RefundVendorCreditGLEntries';
import { RefundVendorCreditGLEntriesSubscriber } from './subscribers/RefundVendorCreditGLEntriesSubscriber';
import { LedgerModule } from '../Ledger/Ledger.module';
import { AccountsModule } from '../Accounts/Accounts.module';

@Module({
  imports: [WarehousesModule, BranchesModule, LedgerModule, AccountsModule],
  providers: [
    GetRefundVendorCreditsService,
    DeleteRefundVendorCreditService,
    CreateRefundVendorCredit,
    VendorCreditsRefundApplication,
    RefundVendorCreditGLEntries,
    RefundVendorCreditGLEntriesSubscriber,
  ],
  controllers: [VendorCreditsRefundController],
})
export class VendorCreditsRefundModule { }
