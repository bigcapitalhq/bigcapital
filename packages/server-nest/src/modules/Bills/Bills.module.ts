import { Module } from '@nestjs/common';
import { BillsApplication } from './Bills.application';
import { CreateBill } from './commands/CreateBill.service';
import { DeleteBill } from './commands/DeleteBill.service';
import { GetBill } from './queries/GetBill';
import { BillDTOTransformer } from './commands/BillDTOTransformer.service';
import { EditBillService } from './commands/EditBill.service';
import { GetDueBills } from './queries/GetDueBills.service';
import { OpenBillService } from './commands/OpenBill.service';
import { BillsValidators } from './commands/BillsValidators.service';
import { ItemsEntriesService } from '../Items/ItemsEntries.service';
import { BranchTransactionDTOTransformer } from '../Branches/integrations/BranchTransactionDTOTransform';
import { BranchesSettingsService } from '../Branches/BranchesSettings';
import { WarehouseTransactionDTOTransform } from '../Warehouses/Integrations/WarehouseTransactionDTOTransform';
import { WarehousesSettings } from '../Warehouses/WarehousesSettings';
import { ItemEntriesTaxTransactions } from '../TaxRates/ItemEntriesTaxTransactions.service';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { BillsController } from './Bills.controller';
import { BillLandedCostsModule } from '../BillLandedCosts/BillLandedCosts.module';
import { BillGLEntriesSubscriber } from './subscribers/BillGLEntriesSubscriber';

@Module({
  imports: [BillLandedCostsModule],
  providers: [
    TenancyContext,
    BillsApplication,
    BranchTransactionDTOTransformer,
    WarehouseTransactionDTOTransform,
    WarehousesSettings,
    ItemEntriesTaxTransactions,
    BranchesSettingsService,
    CreateBill,
    EditBillService,
    GetDueBills,
    OpenBillService,
    GetBill,
    DeleteBill,
    BillDTOTransformer,
    BillsValidators,
    ItemsEntriesService,
    BillGLEntriesSubscriber
  ],
  controllers: [BillsController],
})
export class BillsModule {}
