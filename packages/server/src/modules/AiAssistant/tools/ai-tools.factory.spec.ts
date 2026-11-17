import { Ability } from '@casl/ability';
import { AccountingBasis } from '@/common/types/AccountingBasis';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { ReportsAction } from '@/modules/FinancialStatements/types/Report.types';
import { CustomerAction } from '@/modules/Customers/types/Customers.types';
import { ItemAction } from '@/interfaces/Item';
import { AccountAction } from '@/interfaces/Account';
import { AiToolsFactory } from './ai-tools.factory';

const buildTools = (rules: Array<{ action: string; subject: string }>) =>
  new AiToolsFactory({
    knex: {} as any,
    ability: new Ability(rules),
    baseCurrency: 'USD',
    accountingBasis: AccountingBasis.Accrual,
    fiscalYear: 'January',
  }).build();

const toolNames = (rules: Array<{ action: string; subject: string }>) =>
  Object.keys(buildTools(rules)).sort();

describe('AiToolsFactory', () => {
  it('exposes all tools to an admin', () => {
    expect(toolNames([{ action: 'manage', subject: 'all' }])).toEqual(
      [
        'get_balance_sheet',
        'get_cash_position',
        'get_customer_profitability',
        'get_financial_summary',
        'get_inventory_levels',
        'get_item_performance',
        'get_outstanding_receivables',
        'get_profit_and_loss_breakdown',
        'get_top_customers_by_profit',
        'search_business_records',
      ].sort(),
    );
  });

  it('exposes profit tools to a profit-and-loss reader', () => {
    expect(
      toolNames([
        {
          action: ReportsAction.READ_PROFIT_LOSS,
          subject: AbilitySubject.Report,
        },
      ]),
    ).toEqual(
      [
        'get_customer_profitability',
        'get_financial_summary',
        'get_item_performance',
        'get_profit_and_loss_breakdown',
        'get_top_customers_by_profit',
      ].sort(),
    );
  });

  it('exposes the balance sheet to a balance-sheet reader', () => {
    expect(
      toolNames([
        {
          action: ReportsAction.READ_BALANCE_SHEET,
          subject: AbilitySubject.Report,
        },
      ]),
    ).toEqual(['get_balance_sheet']);
  });

  it('executes the balance sheet tool against the captured knex', async () => {
    const rows = [
      {
        id: 1,
        code: '1000',
        name: 'Cash',
        account_type: 'cash',
        parent_account_id: null,
        account_index: 1,
        credit: '0',
        debit: '100',
      },
      {
        id: 2,
        code: '3000',
        name: 'Equity',
        account_type: 'equity',
        parent_account_id: null,
        account_index: 2,
        credit: '100',
        debit: '0',
      },
    ];
    const knex = {
      raw: jest.fn(() => ({ timeout: async () => [rows] })),
    } as any;
    const tools = new AiToolsFactory({
      knex,
      ability: new Ability([
        {
          action: ReportsAction.READ_BALANCE_SHEET,
          subject: AbilitySubject.Report,
        },
      ]),
      baseCurrency: 'USD',
      accountingBasis: AccountingBasis.Accrual,
      fiscalYear: 'January',
    }).build();

    const result = await (tools.get_balance_sheet as any).execute(
      {},
      { toolCallId: 'test', messages: [] },
    );

    expect(result.found).toBe(true);
    expect(result.totals).toMatchObject({
      assets: 100,
      liabilities: 0,
      equity: 100,
      isBalanced: true,
    });
  });

  it('exposes only item performance to a sales-by-items reader', () => {
    expect(
      toolNames([
        {
          action: ReportsAction.READ_SALES_BY_ITEMS,
          subject: AbilitySubject.Report,
        },
      ]),
    ).toEqual(['get_item_performance']);
  });

  it('exposes customer and receivables tools to a customer viewer', () => {
    expect(
      toolNames([
        { action: CustomerAction.View, subject: AbilitySubject.Customer },
      ]),
    ).toEqual(['get_outstanding_receivables', 'search_business_records']);
  });

  it('exposes cash position to an account viewer', () => {
    expect(
      toolNames([
        { action: AccountAction.VIEW, subject: AbilitySubject.Account },
      ]),
    ).toEqual(['get_cash_position']);
  });

  it('exposes inventory tools to an item viewer', () => {
    expect(
      toolNames([{ action: ItemAction.VIEW, subject: AbilitySubject.Item }]),
    ).toEqual(['get_inventory_levels', 'search_business_records']);
  });

  it('exposes record search to a vendor viewer', () => {
    expect(
      toolNames([{ action: 'View', subject: AbilitySubject.Vendor }]),
    ).toEqual(['search_business_records']);
  });
});
