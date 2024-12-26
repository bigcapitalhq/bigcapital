import { Module } from '@nestjs/common';
import { SaleReceiptApplication } from './SaleReceiptApplication.service';
import { CreateSaleReceipt } from './commands/CreateSaleReceipt.service';
import { EditSaleReceipt } from './commands/EditSaleReceipt.service';
import { GetSaleReceipt } from './queries/GetSaleReceipt.service';
import { DeleteSaleReceipt } from './commands/DeleteSaleReceipt.service';
import { CloseSaleReceipt } from './commands/CloseSaleReceipt.service';
import { SaleReceiptsPdfService } from './queries/SaleReceiptsPdf.service';
import { GetSaleReceiptState } from './queries/GetSaleReceiptState.service';
import { ItemsModule } from '../Items/items.module';
import { SaleReceiptDTOTransformer } from './commands/SaleReceiptDTOTransformer.service';
import { SaleReceiptValidators } from './commands/SaleReceiptValidators.service';
import { ChromiumlyTenancyModule } from '../ChromiumlyTenancy/ChromiumlyTenancy.module';
import { TemplateInjectableModule } from '../TemplateInjectable/TemplateInjectable.module';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { SaleReceiptBrandingTemplate } from './queries/SaleReceiptBrandingTemplate.service';
import { BranchesModule } from '../Branches/Branches.module';
import { WarehousesModule } from '../Warehouses/Warehouses.module';
import { SaleReceiptIncrement } from './commands/SaleReceiptIncrement.service';
import { PdfTemplatesModule } from '../PdfTemplate/PdfTemplates.module';
import { AutoIncrementOrdersModule } from '../AutoIncrementOrders/AutoIncrementOrders.module';
import { SaleReceiptsController } from './SaleReceipts.controller';

@Module({
  controllers: [SaleReceiptsController],
  imports: [
    ItemsModule,
    ChromiumlyTenancyModule,
    TemplateInjectableModule,
    BranchesModule,
    WarehousesModule,
    PdfTemplatesModule,
    AutoIncrementOrdersModule
  ],
  providers: [
    TenancyContext,
    SaleReceiptValidators,
    SaleReceiptApplication,
    CreateSaleReceipt,
    EditSaleReceipt,
    GetSaleReceipt,
    DeleteSaleReceipt,
    CloseSaleReceipt,
    SaleReceiptsPdfService,
    GetSaleReceiptState,
    SaleReceiptDTOTransformer,
    SaleReceiptBrandingTemplate,
    SaleReceiptIncrement,
  ],
})
export class SaleReceiptsModule {}
