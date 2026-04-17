import { Module } from '@nestjs/common';
import { ResourceService } from './ResourceService';
import { BranchesModule } from '../Branches/Branches.module';
import { WarehousesModule } from '../Warehouses/Warehouses.module';
import { AccountsExportable } from '../Accounts/AccountsExportable.service';
import { AccountsModule } from '../Accounts/Accounts.module';
import { ResourceController } from './Resource.controller';
import { CustomFieldsModule } from '../CustomFields/CustomFields.module';

@Module({
  imports: [BranchesModule, WarehousesModule, AccountsModule, CustomFieldsModule],
  providers: [ResourceService],
  exports: [ResourceService],
  controllers: [ResourceController]
})
export class ResourceModule {}
