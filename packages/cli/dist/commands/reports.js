"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReportsCommand = createReportsCommand;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const sdk_ts_1 = require("@bigcapital/sdk-ts");
const config_1 = require("../config");
const errors_1 = require("../utils/errors");
const table_1 = require("../utils/table");
function getDateRange(options) {
    const toDate = options.to || new Date().toISOString().split('T')[0];
    const fromDate = options.from || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    return { fromDate, toDate };
}
function createReportsCommand() {
    const command = new commander_1.Command('reports')
        .description('Financial reports');
    // Balance Sheet
    command
        .command('balance-sheet')
        .description('Show balance sheet')
        .option('--from <date>', 'Start date (YYYY-MM-DD)')
        .option('--to <date>', 'End date (YYYY-MM-DD)')
        .action(async (options) => {
        const spinner = (0, ora_1.default)('Loading balance sheet...').start();
        try {
            const fetcher = (0, config_1.createAuthenticatedFetcher)();
            const { fromDate, toDate } = getDateRange(options);
            const report = await (0, sdk_ts_1.fetchBalanceSheetJson)(fetcher, { fromDate, toDate });
            spinner.stop();
            console.log(chalk_1.default.bold('\n📊 Balance Sheet'));
            console.log(chalk_1.default.gray(`${fromDate} to ${toDate}\n`));
            // Assets
            console.log(chalk_1.default.green.bold('\nASSETS'));
            const assetsTable = (0, table_1.createTable)(['Account', 'Amount']);
            let totalAssets = 0;
            report.assets?.forEach((item) => {
                assetsTable.push([item.accountName, (0, table_1.formatCurrency)(item.total)]);
                totalAssets += item.total;
            });
            assetsTable.push(['', '']);
            assetsTable.push([chalk_1.default.bold('Total Assets'), chalk_1.default.bold((0, table_1.formatCurrency)(totalAssets))]);
            console.log(assetsTable.toString());
            // Liabilities
            console.log(chalk_1.default.red.bold('\nLIABILITIES'));
            const liabilitiesTable = (0, table_1.createTable)(['Account', 'Amount']);
            let totalLiabilities = 0;
            report.liabilities?.forEach((item) => {
                liabilitiesTable.push([item.accountName, (0, table_1.formatCurrency)(item.total)]);
                totalLiabilities += item.total;
            });
            liabilitiesTable.push(['', '']);
            liabilitiesTable.push([chalk_1.default.bold('Total Liabilities'), chalk_1.default.bold((0, table_1.formatCurrency)(totalLiabilities))]);
            console.log(liabilitiesTable.toString());
            // Equity
            console.log(chalk_1.default.blue.bold('\nEQUITY'));
            const equityTable = (0, table_1.createTable)(['Account', 'Amount']);
            let totalEquity = 0;
            report.equity?.forEach((item) => {
                equityTable.push([item.accountName, (0, table_1.formatCurrency)(item.total)]);
                totalEquity += item.total;
            });
            equityTable.push(['', '']);
            equityTable.push([chalk_1.default.bold('Total Equity'), chalk_1.default.bold((0, table_1.formatCurrency)(totalEquity))]);
            console.log(equityTable.toString());
            // Summary
            console.log(chalk_1.default.bold('\n' + '─'.repeat(40)));
            console.log(`${chalk_1.default.bold('Total Liabilities + Equity:')} ${(0, table_1.formatCurrency)(totalLiabilities + totalEquity)}`);
            console.log(`${chalk_1.default.bold('Balance:')} ${totalAssets === (totalLiabilities + totalEquity) ? chalk_1.default.green('✓ Balanced') : chalk_1.default.red('✗ Unbalanced')}\n`);
        }
        catch (error) {
            spinner.stop();
            (0, errors_1.handleError)(error);
        }
    });
    // Profit & Loss
    command
        .command('profit-loss')
        .alias('pl')
        .description('Show profit and loss statement')
        .option('--from <date>', 'Start date (YYYY-MM-DD)')
        .option('--to <date>', 'End date (YYYY-MM-DD)')
        .action(async (options) => {
        const spinner = (0, ora_1.default)('Loading profit & loss...').start();
        try {
            const fetcher = (0, config_1.createAuthenticatedFetcher)();
            const { fromDate, toDate } = getDateRange(options);
            const report = await (0, sdk_ts_1.fetchProfitLossJson)(fetcher, { fromDate, toDate });
            spinner.stop();
            console.log(chalk_1.default.bold('\n📈 Profit & Loss Statement'));
            console.log(chalk_1.default.gray(`${fromDate} to ${toDate}\n`));
            const income = report.income?.total || 0;
            const expenses = report.expenses?.total || 0;
            const netProfit = income - expenses;
            const table = (0, table_1.createTable)(['', 'Amount']);
            table.push([chalk_1.default.green('Total Income'), (0, table_1.formatCurrency)(income)]);
            table.push([chalk_1.default.red('Total Expenses'), (0, table_1.formatCurrency)(expenses)]);
            table.push(['', '']);
            table.push([netProfit >= 0 ? chalk_1.default.green.bold('Net Profit') : chalk_1.default.red.bold('Net Loss'), (0, table_1.formatCurrency)(Math.abs(netProfit))]);
            console.log(table.toString() + '\n');
        }
        catch (error) {
            spinner.stop();
            (0, errors_1.handleError)(error);
        }
    });
    // Cashflow
    command
        .command('cashflow')
        .description('Show cashflow statement')
        .option('--from <date>', 'Start date (YYYY-MM-DD)')
        .option('--to <date>', 'End date (YYYY-MM-DD)')
        .action(async (options) => {
        const spinner = (0, ora_1.default)('Loading cashflow statement...').start();
        try {
            const fetcher = (0, config_1.createAuthenticatedFetcher)();
            const { fromDate, toDate } = getDateRange(options);
            const report = await (0, sdk_ts_1.fetchCashflowStatementJson)(fetcher, { fromDate, toDate });
            spinner.stop();
            console.log(chalk_1.default.bold('\n💰 Cashflow Statement'));
            console.log(chalk_1.default.gray(`${fromDate} to ${toDate}\n`));
            const operating = report.operating?.total || 0;
            const investing = report.investing?.total || 0;
            const financing = report.financing?.total || 0;
            const netCash = operating + investing + financing;
            const table = (0, table_1.createTable)(['Activity', 'Amount']);
            table.push(['Operating Activities', (0, table_1.formatCurrency)(operating)]);
            table.push(['Investing Activities', (0, table_1.formatCurrency)(investing)]);
            table.push(['Financing Activities', (0, table_1.formatCurrency)(financing)]);
            table.push(['', '']);
            table.push([chalk_1.default.bold('Net Cash Change'), chalk_1.default.bold((0, table_1.formatCurrency)(netCash))]);
            console.log(table.toString() + '\n');
        }
        catch (error) {
            spinner.stop();
            (0, errors_1.handleError)(error);
        }
    });
    // Trial Balance
    command
        .command('trial-balance')
        .description('Show trial balance')
        .option('--from <date>', 'Start date (YYYY-MM-DD)')
        .option('--to <date>', 'End date (YYYY-MM-DD)')
        .action(async (options) => {
        const spinner = (0, ora_1.default)('Loading trial balance...').start();
        try {
            const fetcher = (0, config_1.createAuthenticatedFetcher)();
            const { fromDate, toDate } = getDateRange(options);
            const report = await (0, sdk_ts_1.fetchTrialBalanceJson)(fetcher, {});
            spinner.stop();
            console.log(chalk_1.default.bold('\n⚖️ Trial Balance'));
            console.log(chalk_1.default.gray(`${fromDate} to ${toDate}\n`));
            const table = (0, table_1.createTable)(['Account', 'Debit', 'Credit']);
            let totalDebit = 0;
            let totalCredit = 0;
            report.data?.forEach((item) => {
                table.push([item.accountName, (0, table_1.formatCurrency)(item.debit), (0, table_1.formatCurrency)(item.credit)]);
                totalDebit += item.debit;
                totalCredit += item.credit;
            });
            table.push(['', '', '']);
            table.push([chalk_1.default.bold('Total'), chalk_1.default.bold((0, table_1.formatCurrency)(totalDebit)), chalk_1.default.bold((0, table_1.formatCurrency)(totalCredit))]);
            console.log(table.toString());
            console.log(`\n${chalk_1.default.bold('Balance:')} ${Math.abs(totalDebit - totalCredit) < 0.01 ? chalk_1.default.green('✓ Balanced') : chalk_1.default.red('✗ Unbalanced')}\n`);
        }
        catch (error) {
            spinner.stop();
            (0, errors_1.handleError)(error);
        }
    });
    // General Ledger
    command
        .command('general-ledger')
        .description('Show general ledger')
        .option('--from <date>', 'Start date (YYYY-MM-DD)')
        .option('--to <date>', 'End date (YYYY-MM-DD)')
        .action(async (options) => {
        const spinner = (0, ora_1.default)('Loading general ledger...').start();
        try {
            const fetcher = (0, config_1.createAuthenticatedFetcher)();
            const { fromDate, toDate } = getDateRange(options);
            const report = await (0, sdk_ts_1.fetchGeneralLedgerJson)(fetcher, {});
            spinner.stop();
            console.log(chalk_1.default.bold('\n📒 General Ledger'));
            console.log(chalk_1.default.gray(`${fromDate} to ${toDate}\n`));
            console.log(JSON.stringify(report, null, 2));
        }
        catch (error) {
            spinner.stop();
            (0, errors_1.handleError)(error);
        }
    });
    // Journal
    command
        .command('journal')
        .description('Show journal report')
        .option('--from <date>', 'Start date (YYYY-MM-DD)')
        .option('--to <date>', 'End date (YYYY-MM-DD)')
        .action(async (options) => {
        const spinner = (0, ora_1.default)('Loading journal...').start();
        try {
            const fetcher = (0, config_1.createAuthenticatedFetcher)();
            const { fromDate, toDate } = getDateRange(options);
            const report = await (0, sdk_ts_1.fetchJournalJson)(fetcher, {});
            spinner.stop();
            console.log(chalk_1.default.bold('\n📝 Journal Report'));
            console.log(chalk_1.default.gray(`${fromDate} to ${toDate}\n`));
            const table = (0, table_1.createTable)(['Date', 'Reference', 'Account', 'Debit', 'Credit']);
            report.data?.forEach((item) => {
                table.push([item.date, item.reference || '-', item.accountName, (0, table_1.formatCurrency)(item.debit), (0, table_1.formatCurrency)(item.credit)]);
            });
            console.log(table.toString() + '\n');
        }
        catch (error) {
            spinner.stop();
            (0, errors_1.handleError)(error);
        }
    });
    // Receivable Aging
    command
        .command('receivable-aging')
        .description('Show accounts receivable aging')
        .action(async () => {
        const spinner = (0, ora_1.default)('Loading receivable aging...').start();
        try {
            const fetcher = (0, config_1.createAuthenticatedFetcher)();
            const report = await (0, sdk_ts_1.fetchReceivableAgingJson)(fetcher, {});
            spinner.stop();
            console.log(chalk_1.default.bold('\n📋 Accounts Receivable Aging\n'));
            const table = (0, table_1.createTable)(['Customer', 'Current', '1-30', '31-60', '61-90', '90+', 'Total']);
            report.data?.forEach((item) => {
                table.push([
                    item.customerName,
                    (0, table_1.formatCurrency)(item.current),
                    (0, table_1.formatCurrency)(item.days1to30),
                    (0, table_1.formatCurrency)(item.days31to60),
                    (0, table_1.formatCurrency)(item.days61to90),
                    (0, table_1.formatCurrency)(item.over90),
                    chalk_1.default.bold((0, table_1.formatCurrency)(item.total)),
                ]);
            });
            console.log(table.toString() + '\n');
        }
        catch (error) {
            spinner.stop();
            (0, errors_1.handleError)(error);
        }
    });
    // Payable Aging
    command
        .command('payable-aging')
        .description('Show accounts payable aging')
        .action(async () => {
        const spinner = (0, ora_1.default)('Loading payable aging...').start();
        try {
            const fetcher = (0, config_1.createAuthenticatedFetcher)();
            const report = await (0, sdk_ts_1.fetchPayableAgingJson)(fetcher, {});
            spinner.stop();
            console.log(chalk_1.default.bold('\n📋 Accounts Payable Aging\n'));
            const table = (0, table_1.createTable)(['Vendor', 'Current', '1-30', '31-60', '61-90', '90+', 'Total']);
            report.data?.forEach((item) => {
                table.push([
                    item.vendorName,
                    (0, table_1.formatCurrency)(item.current),
                    (0, table_1.formatCurrency)(item.days1to30),
                    (0, table_1.formatCurrency)(item.days31to60),
                    (0, table_1.formatCurrency)(item.days61to90),
                    (0, table_1.formatCurrency)(item.over90),
                    chalk_1.default.bold((0, table_1.formatCurrency)(item.total)),
                ]);
            });
            console.log(table.toString() + '\n');
        }
        catch (error) {
            spinner.stop();
            (0, errors_1.handleError)(error);
        }
    });
    // Customer Balance
    command
        .command('customer-balance')
        .description('Show customer balance summary')
        .action(async () => {
        const spinner = (0, ora_1.default)('Loading customer balances...').start();
        try {
            const fetcher = (0, config_1.createAuthenticatedFetcher)();
            const report = await (0, sdk_ts_1.fetchCustomerBalanceJson)(fetcher, {});
            spinner.stop();
            console.log(chalk_1.default.bold('\n👤 Customer Balance Summary\n'));
            const table = (0, table_1.createTable)(['Customer', 'Total']);
            report.data?.forEach((item) => {
                table.push([item.customerName, (0, table_1.formatCurrency)(item.total)]);
            });
            console.log(table.toString() + '\n');
        }
        catch (error) {
            spinner.stop();
            (0, errors_1.handleError)(error);
        }
    });
    // Vendor Balance
    command
        .command('vendor-balance')
        .description('Show vendor balance summary')
        .action(async () => {
        const spinner = (0, ora_1.default)('Loading vendor balances...').start();
        try {
            const fetcher = (0, config_1.createAuthenticatedFetcher)();
            const report = await (0, sdk_ts_1.fetchVendorBalanceJson)(fetcher, {});
            spinner.stop();
            console.log(chalk_1.default.bold('\n🏢 Vendor Balance Summary\n'));
            const table = (0, table_1.createTable)(['Vendor', 'Total']);
            report.data?.forEach((item) => {
                table.push([item.vendorName, (0, table_1.formatCurrency)(item.total)]);
            });
            console.log(table.toString() + '\n');
        }
        catch (error) {
            spinner.stop();
            (0, errors_1.handleError)(error);
        }
    });
    // Sales by Items
    command
        .command('sales-by-items')
        .description('Show sales by items report')
        .option('--from <date>', 'Start date (YYYY-MM-DD)')
        .option('--to <date>', 'End date (YYYY-MM-DD)')
        .action(async (options) => {
        const spinner = (0, ora_1.default)('Loading sales by items...').start();
        try {
            const fetcher = (0, config_1.createAuthenticatedFetcher)();
            const { fromDate, toDate } = getDateRange(options);
            const report = await (0, sdk_ts_1.fetchSalesByItemsJson)(fetcher, { fromDate, toDate });
            spinner.stop();
            console.log(chalk_1.default.bold('\n🛍️ Sales by Items'));
            console.log(chalk_1.default.gray(`${fromDate} to ${toDate}\n`));
            const table = (0, table_1.createTable)(['Item', 'Quantity', 'Amount']);
            report.data?.forEach((item) => {
                table.push([item.itemName, item.quantity.toString(), (0, table_1.formatCurrency)(item.amount)]);
            });
            console.log(table.toString() + '\n');
        }
        catch (error) {
            spinner.stop();
            (0, errors_1.handleError)(error);
        }
    });
    // Purchases by Items
    command
        .command('purchases-by-items')
        .description('Show purchases by items report')
        .option('--from <date>', 'Start date (YYYY-MM-DD)')
        .option('--to <date>', 'End date (YYYY-MM-DD)')
        .action(async (options) => {
        const spinner = (0, ora_1.default)('Loading purchases by items...').start();
        try {
            const fetcher = (0, config_1.createAuthenticatedFetcher)();
            const { fromDate, toDate } = getDateRange(options);
            const report = await (0, sdk_ts_1.fetchPurchasesByItemsJson)(fetcher, { fromDate, toDate });
            spinner.stop();
            console.log(chalk_1.default.bold('\n🛒 Purchases by Items'));
            console.log(chalk_1.default.gray(`${fromDate} to ${toDate}\n`));
            const table = (0, table_1.createTable)(['Item', 'Quantity', 'Amount']);
            report.data?.forEach((item) => {
                table.push([item.itemName, item.quantity.toString(), (0, table_1.formatCurrency)(item.amount)]);
            });
            console.log(table.toString() + '\n');
        }
        catch (error) {
            spinner.stop();
            (0, errors_1.handleError)(error);
        }
    });
    // Inventory Valuation
    command
        .command('inventory-valuation')
        .description('Show inventory valuation summary')
        .action(async () => {
        const spinner = (0, ora_1.default)('Loading inventory valuation...').start();
        try {
            const fetcher = (0, config_1.createAuthenticatedFetcher)();
            const report = await (0, sdk_ts_1.fetchInventoryValuationJson)(fetcher, {});
            spinner.stop();
            console.log(chalk_1.default.bold('\n📦 Inventory Valuation\n'));
            const table = (0, table_1.createTable)(['Item', 'Qty on Hand', 'Avg Cost', 'Total Value']);
            report.data?.forEach((item) => {
                table.push([item.itemName, item.quantityOnHand.toString(), (0, table_1.formatCurrency)(item.averageCost), (0, table_1.formatCurrency)(item.totalValue)]);
            });
            console.log(table.toString() + '\n');
        }
        catch (error) {
            spinner.stop();
            (0, errors_1.handleError)(error);
        }
    });
    // Inventory Details
    command
        .command('inventory-details')
        .description('Show inventory item details')
        .option('--item <id>', 'Filter by item ID')
        .action(async (options) => {
        const spinner = (0, ora_1.default)('Loading inventory details...').start();
        try {
            const fetcher = (0, config_1.createAuthenticatedFetcher)();
            const report = await (0, sdk_ts_1.fetchInventoryItemDetailsJson)(fetcher, {});
            spinner.stop();
            console.log(chalk_1.default.bold('\n📦 Inventory Item Details\n'));
            console.log(JSON.stringify(report, null, 2));
        }
        catch (error) {
            spinner.stop();
            (0, errors_1.handleError)(error);
        }
    });
    // Sales Tax Liability
    command
        .command('sales-tax-liability')
        .description('Show sales tax liability report')
        .option('--from <date>', 'Start date (YYYY-MM-DD)')
        .option('--to <date>', 'End date (YYYY-MM-DD)')
        .action(async (options) => {
        const spinner = (0, ora_1.default)('Loading sales tax liability...').start();
        try {
            const fetcher = (0, config_1.createAuthenticatedFetcher)();
            const { fromDate, toDate } = getDateRange(options);
            const report = await (0, sdk_ts_1.fetchSalesTaxLiabilityJson)(fetcher, { fromDate, toDate });
            spinner.stop();
            console.log(chalk_1.default.bold('\n💵 Sales Tax Liability'));
            console.log(chalk_1.default.gray(`${fromDate} to ${toDate}\n`));
            const table = (0, table_1.createTable)(['Tax Rate', 'Taxable Amount', 'Tax Amount']);
            report.data?.forEach((item) => {
                table.push([item.taxRateName, (0, table_1.formatCurrency)(item.taxableAmount), (0, table_1.formatCurrency)(item.taxAmount)]);
            });
            console.log(table.toString() + '\n');
        }
        catch (error) {
            spinner.stop();
            (0, errors_1.handleError)(error);
        }
    });
    return command;
}
