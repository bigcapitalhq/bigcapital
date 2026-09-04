"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBillsCommand = createBillsCommand;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const sdk_ts_1 = require("@bigcapital/sdk-ts");
const config_1 = require("../config");
const errors_1 = require("../utils/errors");
const table_1 = require("../utils/table");
function createBillsCommand() {
    const command = new commander_1.Command('bills')
        .description('Manage bills');
    command
        .command('list')
        .description('List all bills')
        .option('-l, --limit <number>', 'Limit number of results per page', '50')
        .option('-p, --page <number>', 'Page number', '1')
        .option('-v, --vendor <id>', 'Filter by vendor ID')
        .option('-s, --status <status>', 'Filter by status (draft, published, paid, partial)')
        .action(async (options) => {
        const spinner = (0, ora_1.default)('Loading bills...').start();
        try {
            const fetcher = (0, config_1.createAuthenticatedFetcher)();
            const query = {
                page: parseInt(options.page, 10),
                pageSize: Math.min(parseInt(options.limit, 10), 100),
                ...(options.vendor && { vendorId: parseInt(options.vendor, 10) }),
                ...(options.status && { status: options.status }),
            };
            const response = await (0, sdk_ts_1.fetchBills)(fetcher, query);
            spinner.stop();
            const bills = response.bills;
            if (!bills || bills.length === 0) {
                console.log(chalk_1.default.yellow('No bills found.'));
                return;
            }
            const pagination = response.pagination;
            if (pagination) {
                const pageSize = pagination.pageSize || pagination.page_size || 10;
                const totalPages = Math.ceil(pagination.total / pageSize);
                console.log(chalk_1.default.gray(`\nPage ${pagination.page} of ${totalPages} (${pagination.total} total bills)\n`));
            }
            const table = (0, table_1.createTable)(['ID', 'Bill #', 'Vendor', 'Date', 'Due Date', 'Total', 'Balance', 'Status']);
            bills.forEach((bill) => {
                table.push([
                    bill.id,
                    bill.billNumber || '-',
                    (0, table_1.truncate)(bill.vendor?.displayName, 20),
                    (0, table_1.formatDate)(bill.billDate),
                    (0, table_1.formatDate)(bill.dueDate),
                    (0, table_1.formatCurrency)(bill.total),
                    (0, table_1.formatCurrency)(bill.balance),
                    (0, table_1.formatStatus)(bill.status),
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
