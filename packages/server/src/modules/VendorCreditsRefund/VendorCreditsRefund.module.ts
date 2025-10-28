import { Module } from '@nestjs/common';
import { GetRefundVendorCreditsService } from './queries/GetRefundVendorCredits.service';
import { DeleteRefundVendorCreditService } from './commands/DeleteRefundVendorCredit.service';
import { VendorCreditsRefundController } from './VendorCreditsRefund.controller';
import { VendorCreditsRefundApplication } from './VendorCreditsRefund.application';
import { CreateRefundVendorCredit } from './commands/CreateRefundVendorCredit.service';
import { WarehousesModule } from '../Warehouses/Warehouses.module';
import { BranchesModule } from '../Branches/Branches.module';

@Module({
  imports: [WarehousesModule, BranchesModule],
  providers: [
    GetRefundVendorCreditsService,
    DeleteRefundVendorCreditService,
    CreateRefundVendorCredit,
    VendorCreditsRefundApplication
  ],
  controllers: [VendorCreditsRefundController],
})
export class VendorCreditsRefundModule {}
