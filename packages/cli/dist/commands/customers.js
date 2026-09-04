"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCustomersCommand = createCustomersCommand;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const sdk_ts_1 = require("@bigcapital/sdk-ts");
const config_1 = require("../config");
const errors_1 = require("../utils/errors");
const table_1 = require("../utils/table");
function createCustomersCommand() {
    const command = new commander_1.Command('customers')
        .description('Manage customers');
    command
        .command('list')
        .description('List all customers')
        .option('-l, --limit <number>', 'Limit number of results per page', '50')
        .option('-p, --page <number>', 'Page number', '1')
        .option('--active-only', 'Show only active customers', false)
        .action(async (options) => {
        const spinner = (0, ora_1.default)('Loading customers...').start();
        try {
            const fetcher = (0, config_1.createAuthenticatedFetcher)();
            const query = {
                page: parseInt(options.page, 10),
                pageSize: Math.min(parseInt(options.limit, 10), 100),
                ...(options.activeOnly && { active: true }),
            };
            const response = await (0, sdk_ts_1.fetchCustomers)(fetcher, query);
            spinner.stop();
            const customers = response.customers;
            if (!customers || customers.length === 0) {
                console.log(chalk_1.default.yellow('No customers found.'));
                return;
            }
            const pagination = response.pagination;
            if (pagination) {
                const pageSize = pagination.pageSize || pagination.page_size || 10;
                const totalPages = Math.ceil(pagination.total / pageSize);
                console.log(chalk_1.default.gray(`\nPage ${pagination.page} of ${totalPages} (${pagination.total} total customers)\n`));
            }
            const table = (0, table_1.createTable)(['ID', 'Name', 'Email', 'Work Phone', 'Personal Phone', 'Balance', 'Status']);
            customers.forEach((customer) => {
                table.push([
                    customer.id,
                    (0, table_1.truncate)(customer.displayName, 25),
                    (0, table_1.truncate)(customer.email, 25) || '-',
                    customer.workPhone || '-',
                    customer.personalPhone || '-',
                    (0, table_1.formatCurrency)(customer.balance),
                    (0, table_1.formatStatus)(customer.active ? 'active' : 'inactive'),
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
