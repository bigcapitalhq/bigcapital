import { Inject, Injectable } from '@nestjs/common';
import type { AccountingQueryFacade } from '@bigcapital/extension-sdk/bridges';
import { Account } from '@/modules/Accounts/models/Account.model';
import { AccountTransaction } from '@/modules/Accounts/models/AccountTransaction.model';
import { SaleInvoice } from '@/modules/SaleInvoices/models/SaleInvoice';
import { Customer } from '@/modules/Customers/models/Customer';
import { Item } from '@/modules/Items/models/Item';
import type { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

/**
 * Read-only, tenant-scoped query facade exposed to report providers.
 *
 * Extensions receive this object through `ReportContext.query`; they never get
 * raw knex access.
 */
@Injectable()
export class ExtensionAccountingQueryService implements AccountingQueryFacade {
  constructor(
    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,

    @Inject(AccountTransaction.name)
    private readonly accountTransactionModel: TenantModelProxy<
      typeof AccountTransaction
    >,

    @Inject(SaleInvoice.name)
    private readonly saleInvoiceModel: TenantModelProxy<typeof SaleInvoice>,

    @Inject(Customer.name)
    private readonly customerModel: TenantModelProxy<typeof Customer>,

    @Inject(Item.name)
    private readonly itemModel: TenantModelProxy<typeof Item>,
  ) {}

  accounts = {
    list: async (): Promise<unknown[]> => {
      return this.accountModel().query();
    },
  };

  ledger = {
    entries: async (filter: Record<string, unknown>): Promise<unknown[]> => {
      const query = this.accountTransactionModel().query();
      const from = stringFilter(filter.from);
      const to = stringFilter(filter.to);
      const accountId = numberFilter(filter.accountId);

      if (from) {
        query.where('date', '>=', from);
      }

      if (to) {
        query.where('date', '<=', to);
      }

      if (accountId !== undefined) {
        query.where('accountId', accountId);
      }

      return query;
    },
  };

  transactions = {
    list: async (filter: Record<string, unknown>): Promise<unknown[]> => {
      const query = this.saleInvoiceModel().query();
      const from = stringFilter(filter.from);
      const to = stringFilter(filter.to);

      if (from) {
        query.where('invoiceDate', '>=', from);
      }

      if (to) {
        query.where('invoiceDate', '<=', to);
      }

      return query;
    },
  };

  contacts = {
    list: async (): Promise<unknown[]> => {
      return this.customerModel().query();
    },
  };

  items = {
    list: async (): Promise<unknown[]> => {
      return this.itemModel().query();
    },
  };
}

function stringFilter(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function numberFilter(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}
