import { Module } from '@nestjs/common';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { TenancyDatabaseModule } from '../Tenancy/TenancyDB/TenancyDB.module';
import { TransformerInjectable } from '../Transformer/TransformerInjectable.service';
import { ActivateCustomer } from './commands/ActivateCustomer.service';
import { CreateCustomer } from './commands/CreateCustomer.service';
import { CustomerValidators } from './commands/CustomerValidators.service';
import { EditCustomer } from './commands/EditCustomer.service';
import { EditOpeningBalanceCustomer } from './commands/EditOpeningBalanceCustomer.service';
import { GetCustomerService } from './queries/GetCustomer.service';
import { CreateEditCustomerDTO } from './commands/CreateEditCustomerDTO.service';
import { CustomersController } from './Customers.controller';
import { CustomersApplication } from './CustomersApplication.service';
import { DeleteCustomer } from './commands/DeleteCustomer.service';
import { CustomersExportable } from './CustomersExportable';
import { CustomersImportable } from './CustomersImportable';
import { GetCustomers } from './queries/GetCustomers.service';
import { DynamicListModule } from '../DynamicListing/DynamicList.module';
import { BulkDeleteCustomersService } from './BulkDeleteCustomers.service';
import { ValidateBulkDeleteCustomersService } from './ValidateBulkDeleteCustomers.service';

@Module({
  imports: [TenancyDatabaseModule, DynamicListModule],
  controllers: [CustomersController],
  providers: [
    ActivateCustomer,
    CreateCustomer,
    CustomerValidators,
    EditCustomer,
    EditOpeningBalanceCustomer,
    CustomerValidators,
    CreateEditCustomerDTO,
    GetCustomerService,
    CustomersApplication,
    DeleteCustomer,
    TenancyContext,
    TransformerInjectable,
    GetCustomerService,
    CustomersExportable,
    CustomersImportable,
    GetCustomers,
    BulkDeleteCustomersService,
    ValidateBulkDeleteCustomersService,
  ],
})
export class CustomersModule {}
