import { Logger } from '@nestjs/common';
import { Ability } from '@casl/ability';
import { Knex } from 'knex';
import { tool, type ToolSet } from 'ai';
import { z } from 'zod';
import { AccountingBasis } from '@/common/types/AccountingBasis';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { ReportsAction } from '@/modules/FinancialStatements/types/Report.types';
import {
  CustomerAction,
  VendorAction,
} from '@/modules/Customers/types/Customers.types';
import { ItemAction } from '@/interfaces/Item';
import { AccountAction } from '@/interfaces/Account';
import { AiAnalyticsRepository } from './AiAnalytics.repository';
import { IRecordMatch } from './AiAnalytics.types';
import { resolveDateRange } from '../utils/date-range';
import { AiBalanceSheetRepository } from './AiBalanceSheet.repository';
import {
  balanceSheetInputSchema,
  balanceSheetOutputSchema,
  type BalanceSheetToolOutput,
} from './AiBalanceSheet.schema';

export interface IAiToolsContext {
  knex: Knex;
  ability: Ability;
  baseCurrency: string;
  accountingBasis: AccountingBasis;
  fiscalYear: string | null;
}

interface IResolvedRecord {
  kind: 'resolved';
  id: number;
  name: string;
}

interface IUnresolvedRecord {
  kind: 'not_found' | 'ambiguous';
  matches: IRecordMatch[];
}

type RecordResolution = IResolvedRecord | IUnresolvedRecord;

const dateFields = {
  fromDate: z
    .string()
    .optional()
    .describe(
      'Start date (inclusive) in YYYY-MM-DD format. Defaults to January 1 of the current year.',
    ),
  toDate: z
    .string()
    .optional()
    .describe('End date (inclusive) in YYYY-MM-DD format. Defaults to today.'),
};

const limitField = (defaultValue: number, max: number) =>
  z
    .number()
    .int()
    .min(1)
    .max(max)
    .optional()
    .describe(
      `Maximum number of rows to return. Defaults to ${defaultValue}, maximum ${max}.`,
    );

/**
 * Builds the read-only tool set for the AI assistant.
 *
 * Tools are filtered by the user's CASL abilities so the model never sees a
 * tool whose data the user is not allowed to access. Every tool executes
 * against the tenant Knex instance captured from the request.
 */
export class AiToolsFactory {
  private readonly logger = new Logger(AiToolsFactory.name);

  constructor(private readonly context: IAiToolsContext) {}

  private get repository(): AiAnalyticsRepository {
    return new AiAnalyticsRepository(this.context.knex);
  }

  private get balanceSheetRepository(): AiBalanceSheetRepository {
    return new AiBalanceSheetRepository(this.context.knex);
  }

  private can(action: string, subject: AbilitySubject): boolean {
    return this.context.ability.can(action, subject);
  }

  private get canReadBalanceSheet(): boolean {
    return this.can(ReportsAction.READ_BALANCE_SHEET, AbilitySubject.Report);
  }

  private get canReadProfitLoss(): boolean {
    return this.can(ReportsAction.READ_PROFIT_LOSS, AbilitySubject.Report);
  }

  private get canReadSalesByItems(): boolean {
    return this.can(ReportsAction.READ_SALES_BY_ITEMS, AbilitySubject.Report);
  }

  private get canReadReceivables(): boolean {
    return this.can(ReportsAction.READ_AR_AGING_SUMMARY, AbilitySubject.Report);
  }

  private get canViewCustomers(): boolean {
    return this.can(CustomerAction.View, AbilitySubject.Customer);
  }

  private get canViewVendors(): boolean {
    return this.can(VendorAction.View, AbilitySubject.Vendor);
  }

  private get canViewItems(): boolean {
    return this.can(ItemAction.VIEW, AbilitySubject.Item);
  }

  private get canViewAccounts(): boolean {
    return this.can(AccountAction.VIEW, AbilitySubject.Account);
  }

  private async safeExecute<T>(
    toolName: string,
    execute: () => Promise<T>,
  ): Promise<T | { error: string }> {
    try {
      return await execute();
    } catch (error) {
      this.logger.warn(
        `AI tool "${toolName}" failed: ${(error as Error)?.message ?? error}`,
      );
      return {
        error:
          'I could not retrieve that data right now. Please try again or check the report directly.',
      };
    }
  }

  private async resolveCustomer(
    customerId?: number,
    customerName?: string,
  ): Promise<RecordResolution> {
    if (customerId) {
      return { kind: 'resolved', id: customerId, name: '' };
    }
    if (!customerName) {
      return { kind: 'not_found', matches: [] };
    }
    const matches = await this.repository.searchCustomers(customerName, 10);
    if (matches.length === 1) {
      return { kind: 'resolved', id: matches[0].id, name: matches[0].name };
    }
    return {
      kind: matches.length === 0 ? 'not_found' : 'ambiguous',
      matches,
    };
  }

  private async resolveItem(
    itemId?: number,
    itemName?: string,
  ): Promise<RecordResolution> {
    if (itemId) {
      return { kind: 'resolved', id: itemId, name: '' };
    }
    if (!itemName) {
      return { kind: 'not_found', matches: [] };
    }
    const matches = await this.repository.searchItems(itemName, 10);
    if (matches.length === 1) {
      return { kind: 'resolved', id: matches[0].id, name: matches[0].name };
    }
    return {
      kind: matches.length === 0 ? 'not_found' : 'ambiguous',
      matches,
    };
  }

  private unresolvedResponse(resolution: IUnresolvedRecord) {
    return {
      found: false,
      reason: resolution.kind,
      matches: resolution.matches,
      message:
        resolution.kind === 'ambiguous'
          ? 'Multiple records match. Ask the user which one they mean before answering.'
          : 'No matching record was found.',
    };
  }

  /**
   * Returns the tool set the current user is allowed to use.
   */
  public build(): ToolSet {
    const tools: ToolSet = {};
    const repository = this.repository;
    const baseCurrency = this.context.baseCurrency;
    const accountingBasis = this.context.accountingBasis;

    if (this.canViewCustomers || this.canViewVendors || this.canViewItems) {
      tools.search_business_records = tool({
        description:
          'Resolve a customer, vendor, or item name to its record ID. Use this before customer/item tools when the user refers to a record by name. Returns matches so you can ask the user to choose when the name is ambiguous.',
        inputSchema: z.object({
          entity: z
            .enum(['customer', 'vendor', 'item'])
            .describe('The kind of record to search.'),
          query: z
            .string()
            .min(1)
            .describe('Full or partial name, or the record code.'),
          limit: limitField(5, 10),
        }),
        execute: async ({ entity, query, limit }) =>
          this.safeExecute('search_business_records', async () => {
            let matches: IRecordMatch[] = [];

            if (entity === 'customer') {
              if (!this.canViewCustomers) {
                return {
                  error: 'The user does not have permission to view customers.',
                };
              }
              matches = await repository.searchCustomers(query, limit);
            } else if (entity === 'vendor') {
              if (!this.canViewVendors) {
                return {
                  error: 'The user does not have permission to view vendors.',
                };
              }
              matches = await repository.searchVendors(query, limit);
            } else {
              if (!this.canViewItems) {
                return {
                  error: 'The user does not have permission to view items.',
                };
              }
              matches = await repository.searchItems(query, limit);
            }

            return { entity, query, matches };
          }),
      });
    }

    if (this.canReadProfitLoss) {
      tools.get_financial_summary = tool({
        description:
          'Get overall financial performance for a date range: revenue, COGS, gross profit, operating expenses, net profit, invoice count, and average invoice value. All amounts are in the organization base currency.',
        inputSchema: z.object(dateFields),
        execute: async ({ fromDate, toDate }) =>
          this.safeExecute('get_financial_summary', async () => {
            const period = resolveDateRange(fromDate, toDate);
            return repository.getFinancialSummary(
              period,
              baseCurrency,
              accountingBasis,
            );
          }),
      });

      tools.get_profit_and_loss_breakdown = tool({
        description:
          'Get a breakdown of the largest income, cost-of-goods-sold, and expense accounts for a date range, with totals and percentages. Use for questions about where revenue or expenses come from.',
        inputSchema: z.object(dateFields),
        execute: async ({ fromDate, toDate }) =>
          this.safeExecute('get_profit_and_loss_breakdown', async () => {
            const period = resolveDateRange(fromDate, toDate);
            return repository.getProfitAndLossBreakdown(
              period,
              baseCurrency,
              accountingBasis,
            );
          }),
      });

      tools.get_top_customers_by_profit = tool({
        description:
          'Rank customers by gross profit for a date range. Returns each customer revenue, COGS, gross profit, margin percentage, invoice count, and overall totals. Use for "most profitable customer" questions.',
        inputSchema: z.object({
          ...dateFields,
          limit: limitField(5, 25),
        }),
        execute: async ({ fromDate, toDate, limit }) =>
          this.safeExecute('get_top_customers_by_profit', async () => {
            const period = resolveDateRange(fromDate, toDate);
            return repository.getTopCustomersByProfit(
              period,
              baseCurrency,
              accountingBasis,
              limit,
            );
          }),
      });

      tools.get_customer_profitability = tool({
        description:
          "Get one customer's revenue, COGS, gross profit, margin, invoice count, outstanding balance, and last invoice date for a date range. Pass customerId, or customerName to resolve it by name. If the name is ambiguous, ask the user to choose from the returned matches.",
        inputSchema: z
          .object({
            ...dateFields,
            customerId: z
              .number()
              .int()
              .positive()
              .optional()
              .describe('Customer ID, when already known.'),
            customerName: z
              .string()
              .min(1)
              .optional()
              .describe('Customer display name or part of it.'),
          })
          .refine((value) => value.customerId || value.customerName, {
            message: 'Provide customerId or customerName.',
          }),
        execute: async ({ customerId, customerName, fromDate, toDate }) =>
          this.safeExecute('get_customer_profitability', async () => {
            const resolution = await this.resolveCustomer(
              customerId,
              customerName,
            );
            if (resolution.kind !== 'resolved') {
              return this.unresolvedResponse(resolution);
            }
            const period = resolveDateRange(fromDate, toDate);
            const customer = await repository.getCustomerProfitability(
              resolution.id,
              period,
              baseCurrency,
              accountingBasis,
            );
            if (!customer) {
              return {
                found: false,
                reason: 'not_found',
                matches: [],
                message: 'No customer was found with that ID.',
              };
            }
            return {
              found: true,
              period,
              currency: baseCurrency,
              customer,
            };
          }),
      });
    }

    if (this.canReadSalesByItems || this.canReadProfitLoss) {
      tools.get_item_performance = tool({
        description:
          'Get sales performance for an item: units sold, revenue, COGS, gross profit, margin percentage, and average selling price for a date range. Pass itemId or itemName to focus on one item; omit both to get the top items by revenue. This is sales turnover, not inventory turnover.',
        inputSchema: z.object({
          ...dateFields,
          itemId: z
            .number()
            .int()
            .positive()
            .optional()
            .describe('Item ID, when already known.'),
          itemName: z
            .string()
            .min(1)
            .optional()
            .describe('Item name or code, or part of it.'),
          limit: limitField(5, 25),
        }),
        execute: async ({ itemId, itemName, fromDate, toDate, limit }) =>
          this.safeExecute('get_item_performance', async () => {
            const period = resolveDateRange(fromDate, toDate);

            if (!itemId && !itemName) {
              const result = await repository.getItemPerformance(
                period,
                baseCurrency,
                accountingBasis,
                [],
                limit,
              );
              return { found: true, ...result };
            }

            const resolution = await this.resolveItem(itemId, itemName);
            if (resolution.kind !== 'resolved') {
              return this.unresolvedResponse(resolution);
            }

            const result = await repository.getItemPerformance(
              period,
              baseCurrency,
              accountingBasis,
              [resolution.id],
              1,
            );
            if (result.items.length === 0) {
              return {
                found: false,
                reason: 'not_found',
                matches: [],
                message: 'No sales were found for that item in this period.',
              };
            }
            return { found: true, ...result };
          }),
      });
    }

    if (this.canReadReceivables || this.canViewCustomers) {
      tools.get_outstanding_receivables = tool({
        description:
          'Get customer receivable balances (who owes money), including the total for base-currency customers. Balances are in each customer currency.',
        inputSchema: z.object({
          limit: limitField(10, 25),
        }),
        execute: async ({ limit }) =>
          this.safeExecute('get_outstanding_receivables', async () => {
            return repository.getOutstandingReceivables(baseCurrency, limit);
          }),
      });
    }

    if (this.canViewAccounts) {
      tools.get_cash_position = tool({
        description:
          'Get cash and bank account balances, plus the total for base-currency accounts.',
        inputSchema: z.object({}),
        execute: async () =>
          this.safeExecute('get_cash_position', async () => {
            return repository.getCashPosition(baseCurrency);
          }),
      });
    }

    if (this.canViewItems) {
      tools.get_inventory_levels = tool({
        description:
          'Get inventory items with quantity on hand, reorder point, cost price, estimated inventory value, and a low-stock flag. Low-stock items are returned first.',
        inputSchema: z.object({
          limit: limitField(10, 50),
        }),
        execute: async ({ limit }) =>
          this.safeExecute('get_inventory_levels', async () => {
            return repository.getInventoryLevels(baseCurrency, limit);
          }),
      });
    }

    if (this.canReadBalanceSheet) {
      tools.get_balance_sheet = tool({
        description:
          'Get the balance sheet as of a date: total assets, liabilities, equity, and the account groups behind them. Use for point-in-time financial-position questions such as "what are my total assets", "how much cash, receivables, or inventory do I have", "is the balance sheet balanced", or an individual balance-sheet account balance. For the whole balance sheet, call the tool with no filters and omit accountQuery. Only set accountQuery when the user explicitly names a specific account. Supports section and group filters, account name/ID focus, zero balances, and comparison to an earlier date (explicit or previous year/month/quarter/period). Amounts are in the organization base currency. Group and section totals are authoritative and include all accounts; account rows are limited to the largest few per group. Do not use this for revenue or expenses over a period; use the profit and loss tools for those.',
        inputSchema: balanceSheetInputSchema,
        outputSchema: balanceSheetOutputSchema,
        execute: async (input): Promise<BalanceSheetToolOutput> =>
          this.safeExecute('get_balance_sheet', async () => {
            return this.balanceSheetRepository.getBalanceSheet(input, {
              baseCurrency,
              accountingBasis,
              fiscalYear: this.context.fiscalYear,
            });
          }),
      });
    }

    return tools;
  }
}
