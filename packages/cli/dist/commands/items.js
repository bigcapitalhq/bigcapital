"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createItemsCommand = createItemsCommand;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const sdk_ts_1 = require("@bigcapital/sdk-ts");
const config_1 = require("../config");
const errors_1 = require("../utils/errors");
const table_1 = require("../utils/table");
function createItemsCommand() {
    const command = new commander_1.Command('items')
        .description('Manage items and products');
    command
        .command('list')
        .description('List all items/products')
        .option('-l, --limit <number>', 'Limit number of results per page', '50')
        .option('-p, --page <number>', 'Page number', '1')
        .option('-t, --type <type>', 'Filter by item type (inventory, service, product)')
        .option('--active-only', 'Show only active items', false)
        .action(async (options) => {
        const spinner = (0, ora_1.default)('Loading items...').start();
        try {
            const fetcher = (0, config_1.createAuthenticatedFetcher)();
            const query = {
                page: parseInt(options.page, 10),
                pageSize: Math.min(parseInt(options.limit, 10), 100),
                ...(options.type && { type: options.type }),
                ...(options.activeOnly && { active: true }),
            };
            const response = await (0, sdk_ts_1.fetchItems)(fetcher, query);
            spinner.stop();
            // The response has 'items' array, not 'data'
            const items = response.items;
            if (!items || items.length === 0) {
                console.log(chalk_1.default.yellow('No items found.'));
                return;
            }
            // Pagination info
            const pagination = response.pagination;
            if (pagination) {
                const pageSize = pagination.pageSize || pagination.page_size || 10;
                const totalPages = Math.ceil(pagination.total / pageSize);
                console.log(chalk_1.default.gray(`\nPage ${pagination.page} of ${totalPages} (${pagination.total} total items)\n`));
            }
            // Create table
            const table = (0, table_1.createTable)(['ID', 'Name', 'Type', 'Sell Price', 'Cost Price', 'Qty', 'Status']);
            items.forEach((item) => {
                table.push([
                    item.id,
                    (0, table_1.truncate)(item.name, 30),
                    item.type || '-',
                    (0, table_1.formatCurrency)(item.sellPrice),
                    (0, table_1.formatCurrency)(item.costPrice),
                    item.quantityOnHand ?? '-',
                    (0, table_1.formatStatus)(item.active ? 'active' : 'inactive'),
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
