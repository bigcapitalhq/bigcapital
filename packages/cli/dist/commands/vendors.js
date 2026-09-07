"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVendorsCommand = createVendorsCommand;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const sdk_ts_1 = require("@bigcapital/sdk-ts");
const config_1 = require("../config");
const errors_1 = require("../utils/errors");
const table_1 = require("../utils/table");
function createVendorsCommand() {
    const command = new commander_1.Command('vendors')
        .description('Manage vendors');
    command
        .command('list')
        .description('List all vendors')
        .option('-l, --limit <number>', 'Limit number of results per page', '50')
        .option('-p, --page <number>', 'Page number', '1')
        .option('--active-only', 'Show only active vendors', false)
        .action(async (options) => {
        const spinner = (0, ora_1.default)('Loading vendors...').start();
        try {
            const fetcher = (0, config_1.createAuthenticatedFetcher)();
            const query = {
                page: parseInt(options.page, 10),
                pageSize: Math.min(parseInt(options.limit, 10), 100),
                ...(options.activeOnly && { active: true }),
            };
            const response = await (0, sdk_ts_1.fetchVendors)(fetcher, query);
            spinner.stop();
            const vendors = response.vendors;
            if (!vendors || vendors.length === 0) {
                console.log(chalk_1.default.yellow('No vendors found.'));
                return;
            }
            const pagination = response.pagination;
            if (pagination) {
                const pageSize = pagination.pageSize || pagination.page_size || 10;
                const totalPages = Math.ceil(pagination.total / pageSize);
                console.log(chalk_1.default.gray(`\nPage ${pagination.page} of ${totalPages} (${pagination.total} total vendors)\n`));
            }
            const table = (0, table_1.createTable)(['ID', 'Name', 'Email', 'Work Phone', 'Personal Phone', 'Balance', 'Status']);
            vendors.forEach((vendor) => {
                table.push([
                    vendor.id,
                    (0, table_1.truncate)(vendor.displayName, 25),
                    (0, table_1.truncate)(vendor.email, 25) || '-',
                    vendor.workPhone || '-',
                    vendor.personalPhone || '-',
                    (0, table_1.formatCurrency)(vendor.balance),
                    (0, table_1.formatStatus)(vendor.active ? 'active' : 'inactive'),
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
