import { Module } from '@nestjs/common';
import { CreateVendorCreditService } from './commands/CreateVendorCredit.service';
import { DeleteVendorCreditService } from './commands/DeleteVendorCredit.service';
import { EditVendorCreditService } from './commands/EditVendorCredit.service';
import { VendorCreditDTOTransformService } from './commands/VendorCreditDTOTransform.service';
import { VendorCreditAutoIncrementService } from './commands/VendorCreditAutoIncrement.service';
import { GetRefundVendorCreditService } from '../VendorCreditsRefund/queries/GetRefundVendorCredit.service';
import GetVendorCreditService from './queries/GetVendorCredit.service';
  
@Module({
  providers: [
    CreateVendorCreditService,
    DeleteVendorCreditService,
    EditVendorCreditService,
    VendorCreditDTOTransformService,
    VendorCreditAutoIncrementService,
    GetRefundVendorCreditService,
    VendorCreditDTOTransformService,
    GetVendorCreditService
  ],
  controllers: [],
})
export class VendorCreditsModule {}
