import { Module } from '@nestjs/common';
import { CreateVendorCreditService } from './commands/CreateVendorCredit.service';
import { DeleteVendorCreditService } from './commands/DeleteVendorCredit.service';
import { EditVendorCreditService } from './commands/EditVendorCredit.service';
import { VendorCreditDTOTransformService } from './commands/VendorCreditDTOTransform.service';
import { VendorCreditAutoIncrementService } from './commands/VendorCreditAutoIncrement.service';
import { GetRefundVendorCreditService } from '../VendorCreditsRefund/queries/GetRefundVendorCredit.service';
import { GetVendorCreditService } from './queries/GetVendorCredit.service';
import { VendorCreditsController } from './VendorCredits.controller';
import { ItemsModule } from '../Items/items.module';
import { TemplateInjectableModule } from '../TemplateInjectable/TemplateInjectable.module';
import { AutoIncrementOrdersModule } from '../AutoIncrementOrders/AutoIncrementOrders.module';
import { ChromiumlyTenancyModule } from '../ChromiumlyTenancy/ChromiumlyTenancy.module';
import { PdfTemplatesModule } from '../PdfTemplate/PdfTemplates.module';
import { BranchesModule } from '../Branches/Branches.module';
import { WarehousesModule } from '../Warehouses/Warehouses.module';
import { VendorCreditsApplicationService } from './VendorCreditsApplication.service';

@Module({
  imports: [
    ItemsModule,
    PdfTemplatesModule,
    ChromiumlyTenancyModule,
    TemplateInjectableModule,
    AutoIncrementOrdersModule,
    BranchesModule,
    WarehousesModule,
  ],
  providers: [
    CreateVendorCreditService,
    DeleteVendorCreditService,
    EditVendorCreditService,
    VendorCreditDTOTransformService,
    VendorCreditAutoIncrementService,
    GetRefundVendorCreditService,
    GetVendorCreditService,
    VendorCreditsApplicationService,
  ],
  exports: [
    CreateVendorCreditService,
    DeleteVendorCreditService,
    EditVendorCreditService,
    VendorCreditDTOTransformService,
    VendorCreditAutoIncrementService,
    GetRefundVendorCreditService,
    GetVendorCreditService,
    VendorCreditsApplicationService,
  ],
  controllers: [VendorCreditsController],
})
export class VendorCreditsModule {}
