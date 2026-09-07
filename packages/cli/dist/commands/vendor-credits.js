"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVendorCreditsCommand = createVendorCreditsCommand;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const sdk_ts_1 = require("@bigcapital/sdk-ts");
const config_1 = require("../config");
const errors_1 = require("../utils/errors");
const table_1 = require("../utils/table");
function createVendorCreditsCommand() {
    const command = new commander_1.Command('vendor-credits')
        .description('Manage vendor credits');
    command
        .command('list')
        .description('List all vendor credits')
        .option('-l, --limit <number>', 'Limit number of results per page', '50')
        .option('-p, --page <number>', 'Page number', '1')
        .option('-v, --vendor <id>', 'Filter by vendor ID')
        .action(async (options) => {
        const spinner = (0, ora_1.default)('Loading vendor credits...').start();
        try {
            const fetcher = (0, config_1.createAuthenticatedFetcher)();
            const query = {
                page: parseInt(options.page, 10),
                pageSize: Math.min(parseInt(options.limit, 10), 100),
                ...(options.vendor && { vendorId: parseInt(options.vendor, 10) }),
            };
            const response = await (0, sdk_ts_1.fetchVendorCredits)(fetcher, query);
            spinner.stop();
            const vendorCredits = response.vendorCredits;
            if (!vendorCredits || vendorCredits.length === 0) {
                console.log(chalk_1.default.yellow('No vendor credits found.'));
                return;
            }
            const pagination = response.pagination;
            if (pagination) {
                const pageSize = pagination.pageSize || pagination.page_size || 10;
                const totalPages = Math.ceil(pagination.total / pageSize);
                console.log(chalk_1.default.gray(`\nPage ${pagination.page} of ${totalPages} (${pagination.total} total vendor credits)\n`));
            }
            const table = (0, table_1.createTable)(['ID', 'VC #', 'Vendor', 'Date', 'Total', 'Balance', 'Status']);
            vendorCredits.forEach((vc) => {
                table.push([
                    vc.id,
                    vc.vendorCreditNumber || '-',
                    (0, table_1.truncate)(vc.vendor?.displayName, 20),
                    (0, table_1.formatDate)(vc.vendorCreditDate),
                    (0, table_1.formatCurrency)(vc.total),
                    (0, table_1.formatCurrency)(vc.balance),
                    (0, table_1.formatStatus)(vc.status),
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
