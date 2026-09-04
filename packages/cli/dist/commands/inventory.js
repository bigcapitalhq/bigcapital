"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInventoryCommand = createInventoryCommand;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const sdk_ts_1 = require("@bigcapital/sdk-ts");
const config_1 = require("../config");
const errors_1 = require("../utils/errors");
const table_1 = require("../utils/table");
function createInventoryCommand() {
    const command = new commander_1.Command('inventory')
        .description('Manage inventory');
    command
        .command('adjustments')
        .description('List inventory adjustments')
        .option('-l, --limit <number>', 'Limit number of results per page', '50')
        .option('-p, --page <number>', 'Page number', '1')
        .action(async (options) => {
        const spinner = (0, ora_1.default)('Loading inventory adjustments...').start();
        try {
            const fetcher = (0, config_1.createAuthenticatedFetcher)();
            const query = {
                page: parseInt(options.page, 10),
                pageSize: Math.min(parseInt(options.limit, 10), 100),
            };
            const response = await (0, sdk_ts_1.fetchInventoryAdjustments)(fetcher, query);
            spinner.stop();
            const adjustments = response.inventoryAdjustments;
            if (!adjustments || adjustments.length === 0) {
                console.log(chalk_1.default.yellow('No inventory adjustments found.'));
                return;
            }
            const pagination = response.pagination;
            if (pagination) {
                const pageSize = pagination.pageSize || pagination.page_size || 10;
                const totalPages = Math.ceil(pagination.total / pageSize);
                console.log(chalk_1.default.gray(`\nPage ${pagination.page} of ${totalPages} (${pagination.total} total adjustments)\n`));
            }
            const table = (0, table_1.createTable)(['ID', 'Date', 'Reference', 'Reason', 'Status']);
            adjustments.forEach((adj) => {
                table.push([
                    adj.id,
                    (0, table_1.formatDate)(adj.adjustmentDate),
                    adj.referenceNo || '-',
                    (0, table_1.truncate)(adj.reason, 30),
                    (0, table_1.formatStatus)(adj.status),
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
    command
        .command('transfers')
        .description('List warehouse transfers')
        .option('-l, --limit <number>', 'Limit number of results per page', '50')
        .option('-p, --page <number>', 'Page number', '1')
        .action(async (options) => {
        const spinner = (0, ora_1.default)('Loading warehouse transfers...').start();
        try {
            const fetcher = (0, config_1.createAuthenticatedFetcher)();
            const query = {
                page: parseInt(options.page, 10),
                pageSize: Math.min(parseInt(options.limit, 10), 100),
            };
            const response = await (0, sdk_ts_1.fetchWarehouseTransfers)(fetcher, query);
            spinner.stop();
            const transfers = response.warehouseTransfers;
            if (!transfers || transfers.length === 0) {
                console.log(chalk_1.default.yellow('No warehouse transfers found.'));
                return;
            }
            const pagination = response.pagination;
            if (pagination) {
                const pageSize = pagination.pageSize || pagination.page_size || 10;
                const totalPages = Math.ceil(pagination.total / pageSize);
                console.log(chalk_1.default.gray(`\nPage ${pagination.page} of ${totalPages} (${pagination.total} total transfers)\n`));
            }
            const table = (0, table_1.createTable)(['ID', 'Date', 'Reference', 'From', 'To', 'Status']);
            transfers.forEach((transfer) => {
                table.push([
                    transfer.id,
                    (0, table_1.formatDate)(transfer.date),
                    transfer.referenceNo || '-',
                    (0, table_1.truncate)(transfer.fromWarehouse?.name, 15),
                    (0, table_1.truncate)(transfer.toWarehouse?.name, 15),
                    (0, table_1.formatStatus)(transfer.status),
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
