import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import {
  fetchBalanceSheetJson,
  fetchProfitLossJson,
  fetchCashflowStatementJson,
  fetchTrialBalanceJson,
  fetchGeneralLedgerJson,
  fetchJournalJson,
  fetchReceivableAgingJson,
  fetchPayableAgingJson,
  fetchCustomerBalanceJson,
  fetchVendorBalanceJson,
  fetchSalesByItemsJson,
  fetchPurchasesByItemsJson,
  fetchInventoryValuationJson,
  fetchInventoryItemDetailsJson,
  fetchSalesTaxLiabilityJson,
} from '@bigcapital/sdk-ts';
import { createAuthenticatedFetcher } from '../config';
import { handleError } from '../utils/errors';
import { createTable, formatCurrency } from '../utils/table';

interface DateRangeOptions {
  from?: string;
  to?: string;
}

function getDateRange(options: DateRangeOptions): { fromDate: string; toDate: string } {
  const toDate = options.to || new Date().toISOString().split('T')[0];
  const fromDate = options.from || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  return { fromDate, toDate };
}

export function createReportsCommand(): Command {
  const command = new Command('reports')
    .description('Financial reports');

  // Balance Sheet
  command
    .command('balance-sheet')
    .description('Show balance sheet')
    .option('--from <date>', 'Start date (YYYY-MM-DD)')
    .option('--to <date>', 'End date (YYYY-MM-DD)')
    .action(async (options: DateRangeOptions) => {
      const spinner = ora('Loading balance sheet...').start();
      try {
        const fetcher = createAuthenticatedFetcher();
        const { fromDate, toDate } = getDateRange(options);
        const report = await fetchBalanceSheetJson(fetcher, { fromDate, toDate } as never);
        spinner.stop();

        console.log(chalk.bold('\n📊 Balance Sheet'));
        console.log(chalk.gray(`${fromDate} to ${toDate}\n`));

        // Assets
        console.log(chalk.green.bold('\nASSETS'));
        const assetsTable = createTable(['Account', 'Amount']);
        let totalAssets = 0;
        (report as unknown as { assets?: Array<{ accountName: string; total: number }> }).assets?.forEach((item) => {
          assetsTable.push([item.accountName, formatCurrency(item.total)]);
          totalAssets += item.total;
        });
        assetsTable.push(['', '']);
        assetsTable.push([chalk.bold('Total Assets'), chalk.bold(formatCurrency(totalAssets))]);
        console.log(assetsTable.toString());

        // Liabilities
        console.log(chalk.red.bold('\nLIABILITIES'));
        const liabilitiesTable = createTable(['Account', 'Amount']);
        let totalLiabilities = 0;
        (report as unknown as { liabilities?: Array<{ accountName: string; total: number }> }).liabilities?.forEach((item) => {
          liabilitiesTable.push([item.accountName, formatCurrency(item.total)]);
          totalLiabilities += item.total;
        });
        liabilitiesTable.push(['', '']);
        liabilitiesTable.push([chalk.bold('Total Liabilities'), chalk.bold(formatCurrency(totalLiabilities))]);
        console.log(liabilitiesTable.toString());

        // Equity
        console.log(chalk.blue.bold('\nEQUITY'));
        const equityTable = createTable(['Account', 'Amount']);
        let totalEquity = 0;
        (report as unknown as { equity?: Array<{ accountName: string; total: number }> }).equity?.forEach((item) => {
          equityTable.push([item.accountName, formatCurrency(item.total)]);
          totalEquity += item.total;
        });
        equityTable.push(['', '']);
        equityTable.push([chalk.bold('Total Equity'), chalk.bold(formatCurrency(totalEquity))]);
        console.log(equityTable.toString());

        // Summary
        console.log(chalk.bold('\n' + '─'.repeat(40)));
        console.log(`${chalk.bold('Total Liabilities + Equity:')} ${formatCurrency(totalLiabilities + totalEquity)}`);
        console.log(`${chalk.bold('Balance:')} ${totalAssets === (totalLiabilities + totalEquity) ? chalk.green('✓ Balanced') : chalk.red('✗ Unbalanced')}\n`);
      } catch (error) {
        spinner.stop();
        handleError(error);
      }
    });

  // Profit & Loss
  command
    .command('profit-loss')
    .alias('pl')
    .description('Show profit and loss statement')
    .option('--from <date>', 'Start date (YYYY-MM-DD)')
    .option('--to <date>', 'End date (YYYY-MM-DD)')
    .action(async (options: DateRangeOptions) => {
      const spinner = ora('Loading profit & loss...').start();
      try {
        const fetcher = createAuthenticatedFetcher();
        const { fromDate, toDate } = getDateRange(options);
        const report = await fetchProfitLossJson(fetcher, { fromDate, toDate } as never);
        spinner.stop();

        console.log(chalk.bold('\n📈 Profit & Loss Statement'));
        console.log(chalk.gray(`${fromDate} to ${toDate}\n`));

        const income = (report as unknown as { income?: { total: number } }).income?.total || 0;
        const expenses = (report as unknown as { expenses?: { total: number } }).expenses?.total || 0;
        const netProfit = income - expenses;

        const table = createTable(['', 'Amount']);
        table.push([chalk.green('Total Income'), formatCurrency(income)]);
        table.push([chalk.red('Total Expenses'), formatCurrency(expenses)]);
        table.push(['', '']);
        table.push([netProfit >= 0 ? chalk.green.bold('Net Profit') : chalk.red.bold('Net Loss'), formatCurrency(Math.abs(netProfit))]);

        console.log(table.toString() + '\n');
      } catch (error) {
        spinner.stop();
        handleError(error);
      }
    });

  // Cashflow
  command
    .command('cashflow')
    .description('Show cashflow statement')
    .option('--from <date>', 'Start date (YYYY-MM-DD)')
    .option('--to <date>', 'End date (YYYY-MM-DD)')
    .action(async (options: DateRangeOptions) => {
      const spinner = ora('Loading cashflow statement...').start();
      try {
        const fetcher = createAuthenticatedFetcher();
        const { fromDate, toDate } = getDateRange(options);
        const report = await fetchCashflowStatementJson(fetcher, { fromDate, toDate } as never);
        spinner.stop();

        console.log(chalk.bold('\n💰 Cashflow Statement'));
        console.log(chalk.gray(`${fromDate} to ${toDate}\n`));

        const operating = (report as unknown as { operating?: { total: number } }).operating?.total || 0;
        const investing = (report as unknown as { investing?: { total: number } }).investing?.total || 0;
        const financing = (report as unknown as { financing?: { total: number } }).financing?.total || 0;
        const netCash = operating + investing + financing;

        const table = createTable(['Activity', 'Amount']);
        table.push(['Operating Activities', formatCurrency(operating)]);
        table.push(['Investing Activities', formatCurrency(investing)]);
        table.push(['Financing Activities', formatCurrency(financing)]);
        table.push(['', '']);
        table.push([chalk.bold('Net Cash Change'), chalk.bold(formatCurrency(netCash))]);

        console.log(table.toString() + '\n');
      } catch (error) {
        spinner.stop();
        handleError(error);
      }
    });

  // Trial Balance
  command
    .command('trial-balance')
    .description('Show trial balance')
    .option('--from <date>', 'Start date (YYYY-MM-DD)')
    .option('--to <date>', 'End date (YYYY-MM-DD)')
    .action(async (options: DateRangeOptions) => {
      const spinner = ora('Loading trial balance...').start();
      try {
        const fetcher = createAuthenticatedFetcher();
        const { fromDate, toDate } = getDateRange(options);
        const report = await fetchTrialBalanceJson(fetcher, {} as never);
        spinner.stop();

        console.log(chalk.bold('\n⚖️ Trial Balance'));
        console.log(chalk.gray(`${fromDate} to ${toDate}\n`));

        const table = createTable(['Account', 'Debit', 'Credit']);
        let totalDebit = 0;
        let totalCredit = 0;

        (report as unknown as { data?: Array<{ accountName: string; debit: number; credit: number }> }).data?.forEach((item) => {
          table.push([item.accountName, formatCurrency(item.debit), formatCurrency(item.credit)]);
          totalDebit += item.debit;
          totalCredit += item.credit;
        });

        table.push(['', '', '']);
        table.push([chalk.bold('Total'), chalk.bold(formatCurrency(totalDebit)), chalk.bold(formatCurrency(totalCredit))]);

        console.log(table.toString());
        console.log(`\n${chalk.bold('Balance:')} ${Math.abs(totalDebit - totalCredit) < 0.01 ? chalk.green('✓ Balanced') : chalk.red('✗ Unbalanced')}\n`);
      } catch (error) {
        spinner.stop();
        handleError(error);
      }
    });

  // General Ledger
  command
    .command('general-ledger')
    .description('Show general ledger')
    .option('--from <date>', 'Start date (YYYY-MM-DD)')
    .option('--to <date>', 'End date (YYYY-MM-DD)')
    .action(async (options: DateRangeOptions) => {
      const spinner = ora('Loading general ledger...').start();
      try {
        const fetcher = createAuthenticatedFetcher();
        const { fromDate, toDate } = getDateRange(options);
        const report = await fetchGeneralLedgerJson(fetcher, {} as never);
        spinner.stop();

        console.log(chalk.bold('\n📒 General Ledger'));
        console.log(chalk.gray(`${fromDate} to ${toDate}\n`));
        console.log(JSON.stringify(report, null, 2));
      } catch (error) {
        spinner.stop();
        handleError(error);
      }
    });

  // Journal
  command
    .command('journal')
    .description('Show journal report')
    .option('--from <date>', 'Start date (YYYY-MM-DD)')
    .option('--to <date>', 'End date (YYYY-MM-DD)')
    .action(async (options: DateRangeOptions) => {
      const spinner = ora('Loading journal...').start();
      try {
        const fetcher = createAuthenticatedFetcher();
        const { fromDate, toDate } = getDateRange(options);
        const report = await fetchJournalJson(fetcher, {} as never);
        spinner.stop();

        console.log(chalk.bold('\n📝 Journal Report'));
        console.log(chalk.gray(`${fromDate} to ${toDate}\n`));

        const table = createTable(['Date', 'Reference', 'Account', 'Debit', 'Credit']);
        (report as unknown as { data?: Array<{ date: string; reference: string; accountName: string; debit: number; credit: number }> }).data?.forEach((item) => {
          table.push([item.date, item.reference || '-', item.accountName, formatCurrency(item.debit), formatCurrency(item.credit)]);
        });

        console.log(table.toString() + '\n');
      } catch (error) {
        spinner.stop();
        handleError(error);
      }
    });

  // Receivable Aging
  command
    .command('receivable-aging')
    .description('Show accounts receivable aging')
    .action(async () => {
      const spinner = ora('Loading receivable aging...').start();
      try {
        const fetcher = createAuthenticatedFetcher();
        const report = await fetchReceivableAgingJson(fetcher, {} as never);
        spinner.stop();

        console.log(chalk.bold('\n📋 Accounts Receivable Aging\n'));

        const table = createTable(['Customer', 'Current', '1-30', '31-60', '61-90', '90+', 'Total']);
        (report as unknown as { data?: Array<{ customerName: string; current: number; days1to30: number; days31to60: number; days61to90: number; over90: number; total: number }> }).data?.forEach((item) => {
          table.push([
            item.customerName,
            formatCurrency(item.current),
            formatCurrency(item.days1to30),
            formatCurrency(item.days31to60),
            formatCurrency(item.days61to90),
            formatCurrency(item.over90),
            chalk.bold(formatCurrency(item.total)),
          ]);
        });

        console.log(table.toString() + '\n');
      } catch (error) {
        spinner.stop();
        handleError(error);
      }
    });

  // Payable Aging
  command
    .command('payable-aging')
    .description('Show accounts payable aging')
    .action(async () => {
      const spinner = ora('Loading payable aging...').start();
      try {
        const fetcher = createAuthenticatedFetcher();
        const report = await fetchPayableAgingJson(fetcher, {} as never);
        spinner.stop();

        console.log(chalk.bold('\n📋 Accounts Payable Aging\n'));

        const table = createTable(['Vendor', 'Current', '1-30', '31-60', '61-90', '90+', 'Total']);
        (report as unknown as { data?: Array<{ vendorName: string; current: number; days1to30: number; days31to60: number; days61to90: number; over90: number; total: number }> }).data?.forEach((item) => {
          table.push([
            item.vendorName,
            formatCurrency(item.current),
            formatCurrency(item.days1to30),
            formatCurrency(item.days31to60),
            formatCurrency(item.days61to90),
            formatCurrency(item.over90),
            chalk.bold(formatCurrency(item.total)),
          ]);
        });

        console.log(table.toString() + '\n');
      } catch (error) {
        spinner.stop();
        handleError(error);
      }
    });

  // Customer Balance
  command
    .command('customer-balance')
    .description('Show customer balance summary')
    .action(async () => {
      const spinner = ora('Loading customer balances...').start();
      try {
        const fetcher = createAuthenticatedFetcher();
        const report = await fetchCustomerBalanceJson(fetcher, {} as never);
        spinner.stop();

        console.log(chalk.bold('\n👤 Customer Balance Summary\n'));

        const table = createTable(['Customer', 'Total']);
        (report as unknown as { data?: Array<{ customerName: string; total: number }> }).data?.forEach((item) => {
          table.push([item.customerName, formatCurrency(item.total)]);
        });

        console.log(table.toString() + '\n');
      } catch (error) {
        spinner.stop();
        handleError(error);
      }
    });

  // Vendor Balance
  command
    .command('vendor-balance')
    .description('Show vendor balance summary')
    .action(async () => {
      const spinner = ora('Loading vendor balances...').start();
      try {
        const fetcher = createAuthenticatedFetcher();
        const report = await fetchVendorBalanceJson(fetcher, {} as never);
        spinner.stop();

        console.log(chalk.bold('\n🏢 Vendor Balance Summary\n'));

        const table = createTable(['Vendor', 'Total']);
        (report as unknown as { data?: Array<{ vendorName: string; total: number }> }).data?.forEach((item) => {
          table.push([item.vendorName, formatCurrency(item.total)]);
        });

        console.log(table.toString() + '\n');
      } catch (error) {
        spinner.stop();
        handleError(error);
      }
    });

  // Sales by Items
  command
    .command('sales-by-items')
    .description('Show sales by items report')
    .option('--from <date>', 'Start date (YYYY-MM-DD)')
    .option('--to <date>', 'End date (YYYY-MM-DD)')
    .action(async (options: DateRangeOptions) => {
      const spinner = ora('Loading sales by items...').start();
      try {
        const fetcher = createAuthenticatedFetcher();
        const { fromDate, toDate } = getDateRange(options);
        const report = await fetchSalesByItemsJson(fetcher, { fromDate, toDate } as never);
        spinner.stop();

        console.log(chalk.bold('\n🛍️ Sales by Items'));
        console.log(chalk.gray(`${fromDate} to ${toDate}\n`));

        const table = createTable(['Item', 'Quantity', 'Amount']);
        (report as unknown as { data?: Array<{ itemName: string; quantity: number; amount: number }> }).data?.forEach((item) => {
          table.push([item.itemName, item.quantity.toString(), formatCurrency(item.amount)]);
        });

        console.log(table.toString() + '\n');
      } catch (error) {
        spinner.stop();
        handleError(error);
      }
    });

  // Purchases by Items
  command
    .command('purchases-by-items')
    .description('Show purchases by items report')
    .option('--from <date>', 'Start date (YYYY-MM-DD)')
    .option('--to <date>', 'End date (YYYY-MM-DD)')
    .action(async (options: DateRangeOptions) => {
      const spinner = ora('Loading purchases by items...').start();
      try {
        const fetcher = createAuthenticatedFetcher();
        const { fromDate, toDate } = getDateRange(options);
        const report = await fetchPurchasesByItemsJson(fetcher, { fromDate, toDate } as never);
        spinner.stop();

        console.log(chalk.bold('\n🛒 Purchases by Items'));
        console.log(chalk.gray(`${fromDate} to ${toDate}\n`));

        const table = createTable(['Item', 'Quantity', 'Amount']);
        (report as unknown as { data?: Array<{ itemName: string; quantity: number; amount: number }> }).data?.forEach((item) => {
          table.push([item.itemName, item.quantity.toString(), formatCurrency(item.amount)]);
        });

        console.log(table.toString() + '\n');
      } catch (error) {
        spinner.stop();
        handleError(error);
      }
    });

  // Inventory Valuation
  command
    .command('inventory-valuation')
    .description('Show inventory valuation summary')
    .action(async () => {
      const spinner = ora('Loading inventory valuation...').start();
      try {
        const fetcher = createAuthenticatedFetcher();
        const report = await fetchInventoryValuationJson(fetcher, {} as never);
        spinner.stop();

        console.log(chalk.bold('\n📦 Inventory Valuation\n'));

        const table = createTable(['Item', 'Qty on Hand', 'Avg Cost', 'Total Value']);
        (report as unknown as { data?: Array<{ itemName: string; quantityOnHand: number; averageCost: number; totalValue: number }> }).data?.forEach((item) => {
          table.push([item.itemName, item.quantityOnHand.toString(), formatCurrency(item.averageCost), formatCurrency(item.totalValue)]);
        });

        console.log(table.toString() + '\n');
      } catch (error) {
        spinner.stop();
        handleError(error);
      }
    });

  // Inventory Details
  command
    .command('inventory-details')
    .description('Show inventory item details')
    .option('--item <id>', 'Filter by item ID')
    .action(async (options: { item?: string }) => {
      const spinner = ora('Loading inventory details...').start();
      try {
        const fetcher = createAuthenticatedFetcher();
        const report = await fetchInventoryItemDetailsJson(fetcher, {} as never);
        spinner.stop();

        console.log(chalk.bold('\n📦 Inventory Item Details\n'));
        console.log(JSON.stringify(report, null, 2));
      } catch (error) {
        spinner.stop();
        handleError(error);
      }
    });

  // Sales Tax Liability
  command
    .command('sales-tax-liability')
    .description('Show sales tax liability report')
    .option('--from <date>', 'Start date (YYYY-MM-DD)')
    .option('--to <date>', 'End date (YYYY-MM-DD)')
    .action(async (options: DateRangeOptions) => {
      const spinner = ora('Loading sales tax liability...').start();
      try {
        const fetcher = createAuthenticatedFetcher();
        const { fromDate, toDate } = getDateRange(options);
        const report = await fetchSalesTaxLiabilityJson(fetcher, { fromDate, toDate } as never);
        spinner.stop();

        console.log(chalk.bold('\n💵 Sales Tax Liability'));
        console.log(chalk.gray(`${fromDate} to ${toDate}\n`));

        const table = createTable(['Tax Rate', 'Taxable Amount', 'Tax Amount']);
        (report as unknown as { data?: Array<{ taxRateName: string; taxableAmount: number; taxAmount: number }> }).data?.forEach((item) => {
          table.push([item.taxRateName, formatCurrency(item.taxableAmount), formatCurrency(item.taxAmount)]);
        });

        console.log(table.toString() + '\n');
      } catch (error) {
        spinner.stop();
        handleError(error);
      }
    });

  return command;
}
