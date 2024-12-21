import { Knex } from 'knex';
import { Global, Module, Scope } from '@nestjs/common';
import { TENANCY_DB_CONNECTION } from '../TenancyDB/TenancyDB.constants';

import { Item } from '../../../modules/Items/models/Item';
import { Account } from '@/modules/Accounts/models/Account.model';
import { ItemEntry } from '@/modules/Items/models/ItemEntry';
import { AccountTransaction } from '@/modules/Accounts/models/AccountTransaction.model';
import { Expense } from '@/modules/Expenses/models/Expense.model';
import ExpenseCategory from '@/modules/Expenses/models/ExpenseCategory.model';
import { ItemCategory } from '@/modules/ItemCategories/models/ItemCategory.model';
import { TaxRateModel } from '@/modules/TaxRates/models/TaxRate.model';
import { PdfTemplateModel } from '@/modules/PdfTemplate/models/PdfTemplate';
import { Warehouse } from '@/modules/Warehouses/models/Warehouse.model';
import { ItemWarehouseQuantity } from '@/modules/Warehouses/models/ItemWarehouseQuantity';
import { Branch } from '@/modules/Branches/models/Branch.model';

const models = [
  Item,
  Account,
  ItemEntry,
  AccountTransaction,
  Expense,
  ExpenseCategory,
  ItemCategory,
  TaxRateModel,
  PdfTemplateModel,
  Warehouse,
  ItemWarehouseQuantity,
  Branch,
];

const modelProviders = models.map((model) => {
  return {
    provide: model.name,
    inject: [TENANCY_DB_CONNECTION],
    scope: Scope.REQUEST,
    useFactory: async (tenantKnex: Knex) => {
      return model.bindKnex(tenantKnex);
    },
  };
});

@Global()
@Module({
  providers: [...modelProviders],
  exports: [...modelProviders],
})
export class TenancyModelsModule {}
