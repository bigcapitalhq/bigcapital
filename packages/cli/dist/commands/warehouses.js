"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWarehousesCommand = createWarehousesCommand;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const sdk_ts_1 = require("@bigcapital/sdk-ts");
const config_1 = require("../config");
const errors_1 = require("../utils/errors");
const table_1 = require("../utils/table");
function createWarehousesCommand() {
    const command = new commander_1.Command('warehouses')
        .description('Manage warehouses');
    command
        .command('list')
        .description('List all warehouses')
        .action(async () => {
        const spinner = (0, ora_1.default)('Loading warehouses...').start();
        try {
            const fetcher = (0, config_1.createAuthenticatedFetcher)();
            const response = await (0, sdk_ts_1.fetchWarehouses)(fetcher);
            spinner.stop();
            const warehouses = response.warehouses;
            if (!warehouses || warehouses.length === 0) {
                console.log(chalk_1.default.yellow('No warehouses found.'));
                return;
            }
            const table = (0, table_1.createTable)(['ID', 'Code', 'Name', 'City', 'Status']);
            warehouses.forEach((warehouse) => {
                table.push([
                    warehouse.id,
                    warehouse.code || '-',
                    warehouse.name || '-',
                    warehouse.city || '-',
                    (0, table_1.formatStatus)(warehouse.active ? 'active' : 'inactive'),
                ]);
            });
            console.log(table.toString());
        }
        catch (error) {
            spinner.stop();
            (0, errors_1.handleError)(error);
        }
    });
    return command;
}
