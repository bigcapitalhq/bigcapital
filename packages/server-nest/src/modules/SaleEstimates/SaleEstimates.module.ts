import { Module } from '@nestjs/common';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { TenancyDatabaseModule } from '../Tenancy/TenancyDB/TenancyDB.module';
import { TransformerInjectable } from '../Transformer/TransformerInjectable.service';
import { ApproveSaleEstimateService } from './commands/ApproveSaleEstimate.service';
import { ConvertSaleEstimate } from './commands/ConvetSaleEstimate.service';
import { CreateSaleEstimate } from './commands/CreateSaleEstimate.service';
import { DeliverSaleEstimateService } from './commands/DeliverSaleEstimate.service';
import { EditSaleEstimate } from './commands/EditSaleEstimate.service';
import { RejectSaleEstimateService } from './commands/RejectSaleEstimate.service';
import { SaleEstimateValidators } from './commands/SaleEstimateValidators.service';
import { SaleEstimatesController } from './SaleEstimates.controller';
import { ItemsEntriesService } from '../Items/ItemsEntries.service';
import { SaleEstimateDTOTransformer } from './commands/SaleEstimateDTOTransformer.service';
import { BranchTransactionDTOTransformer } from '../Branches/integrations/BranchTransactionDTOTransform';
import { BranchesSettingsService } from '../Branches/BranchesSettings';
import { WarehouseTransactionDTOTransform } from '../Warehouses/Integrations/WarehouseTransactionDTOTransform';
import { WarehousesSettings } from '../Warehouses/WarehousesSettings';
import { SaleEstimateIncrement } from './commands/SaleEstimateIncrement.service';
import { AutoIncrementOrdersService } from '../AutoIncrementOrders/AutoIncrementOrders.service';
import { BrandingTemplateDTOTransformer } from '../PdfTemplate/BrandingTemplateDTOTransformer';
import { SaleEstimatesApplication } from './SaleEstimates.application';
import { DeleteSaleEstimate } from './commands/DeleteSaleEstimate.service';
import { GetSaleEstimate } from './queries/GetSaleEstimate.service';
import { GetSaleEstimateState } from './queries/GetSaleEstimateState.service';
// import { SaleEstimateNotifyBySms } from './commands/SaleEstimateSmsNotify';
// import { SendSaleEstimateMail } from './commands/SendSaleEstimateMail';
//
@Module({
  imports: [TenancyDatabaseModule],
  controllers: [SaleEstimatesController],
  providers: [
    AutoIncrementOrdersService,
    BrandingTemplateDTOTransformer,
    SaleEstimateIncrement,
    CreateSaleEstimate,
    ConvertSaleEstimate,
    EditSaleEstimate,
    DeleteSaleEstimate,
    GetSaleEstimate,
    GetSaleEstimateState,
    ApproveSaleEstimateService,
    DeliverSaleEstimateService,
    RejectSaleEstimateService,
    SaleEstimateValidators,
    ItemsEntriesService,
    BranchesSettingsService,
    WarehousesSettings,
    BranchTransactionDTOTransformer,
    WarehouseTransactionDTOTransform,
    SaleEstimateDTOTransformer,
    TenancyContext,
    TransformerInjectable,
    SaleEstimatesApplication
    // SaleEstimateNotifyBySms,
    // SendSaleEstimateMail,p
  ],
})
export class SaleEstimatesModule {}
