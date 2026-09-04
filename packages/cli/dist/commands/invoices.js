"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInvoicesCommand = createInvoicesCommand;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const sdk_ts_1 = require("@bigcapital/sdk-ts");
const config_1 = require("../config");
const errors_1 = require("../utils/errors");
const table_1 = require("../utils/table");
function createInvoicesCommand() {
    const command = new commander_1.Command('invoices')
        .description('Manage sale invoices');
    command
        .command('list')
        .description('List all sale invoices')
        .option('-l, --limit <number>', 'Limit number of results per page', '50')
        .option('-p, --page <number>', 'Page number', '1')
        .option('-c, --customer <id>', 'Filter by customer ID')
        .option('-s, --status <status>', 'Filter by status (draft, published, paid, partial, overdue)')
        .action(async (options) => {
        const spinner = (0, ora_1.default)('Loading invoices...').start();
        try {
            const fetcher = (0, config_1.createAuthenticatedFetcher)();
            const query = {
                page: parseInt(options.page, 10),
                pageSize: Math.min(parseInt(options.limit, 10), 100),
                ...(options.customer && { customerId: parseInt(options.customer, 10) }),
                ...(options.status && { status: options.status }),
            };
            const response = await (0, sdk_ts_1.fetchSaleInvoices)(fetcher, query);
            spinner.stop();
            // The response has 'salesInvoices' array (camelCase from middleware), not 'data'
            const invoices = response.salesInvoices;
            if (!invoices || invoices.length === 0) {
                console.log(chalk_1.default.yellow('No invoices found.'));
                return;
            }
            // Pagination info
            const pagination = response.pagination;
            if (pagination) {
                const pageSize = pagination.pageSize || pagination.page_size || 10;
                const totalPages = Math.ceil(pagination.total / pageSize);
                console.log(chalk_1.default.gray(`\nPage ${pagination.page} of ${totalPages} (${pagination.total} total invoices)\n`));
            }
            // Create table
            const table = (0, table_1.createTable)(['ID', 'Invoice #', 'Customer', 'Date', 'Total', 'Balance', 'Status']);
            invoices.forEach((invoice) => {
                table.push([
                    invoice.id,
                    invoice.invoiceNo || '-',
                    (0, table_1.truncate)(invoice.customer?.displayName, 25),
                    (0, table_1.formatDate)(invoice.invoiceDate),
                    (0, table_1.formatCurrency)(invoice.total),
                    (0, table_1.formatCurrency)(invoice.balance),
                    (0, table_1.formatStatus)(invoice.status),
                ]);
            });
            console.log(table.toString());
            if (pagination) {
                const pageSize = pagination.pageSize || pagination.page_size || 10;
                const totalPages = Math.ceil(pagination.total / pageSize);
                if (pagination.page < totalPages) {
                    console.log(chalk_1.default.gray(`\nUse --page ${pagination.page + 1} to see more results`));
                }
            }
        }
        catch (error) {
            spinner.stop();
            (0, errors_1.handleError)(error);
        }
    });
    return command;
}
