"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEstimatesCommand = createEstimatesCommand;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const sdk_ts_1 = require("@bigcapital/sdk-ts");
const config_1 = require("../config");
const errors_1 = require("../utils/errors");
const table_1 = require("../utils/table");
function createEstimatesCommand() {
    const command = new commander_1.Command('estimates')
        .description('Manage sale estimates/quotes');
    command
        .command('list')
        .description('List all sale estimates')
        .option('-l, --limit <number>', 'Limit number of results per page', '50')
        .option('-p, --page <number>', 'Page number', '1')
        .option('-c, --customer <id>', 'Filter by customer ID')
        .option('-s, --status <status>', 'Filter by status (draft, published)')
        .action(async (options) => {
        const spinner = (0, ora_1.default)('Loading estimates...').start();
        try {
            const fetcher = (0, config_1.createAuthenticatedFetcher)();
            const query = {
                page: parseInt(options.page, 10),
                pageSize: Math.min(parseInt(options.limit, 10), 100),
                ...(options.customer && { customerId: parseInt(options.customer, 10) }),
                ...(options.status && { status: options.status }),
            };
            const response = await (0, sdk_ts_1.fetchSaleEstimates)(fetcher, query);
            spinner.stop();
            const estimates = response.saleEstimates;
            if (!estimates || estimates.length === 0) {
                console.log(chalk_1.default.yellow('No estimates found.'));
                return;
            }
            const pagination = response.pagination;
            if (pagination) {
                const pageSize = pagination.pageSize || pagination.page_size || 10;
                const totalPages = Math.ceil(pagination.total / pageSize);
                console.log(chalk_1.default.gray(`\nPage ${pagination.page} of ${totalPages} (${pagination.total} total estimates)\n`));
            }
            const table = (0, table_1.createTable)(['ID', 'Estimate #', 'Customer', 'Date', 'Expires', 'Total', 'Status']);
            estimates.forEach((estimate) => {
                table.push([
                    estimate.id,
                    estimate.estimateNumber || '-',
                    (0, table_1.truncate)(estimate.customer?.displayName, 20),
                    (0, table_1.formatDate)(estimate.estimateDate),
                    (0, table_1.formatDate)(estimate.expirationDate),
                    (0, table_1.formatCurrency)(estimate.total),
                    (0, table_1.formatStatus)(estimate.status),
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
