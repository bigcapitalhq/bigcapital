"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaxRatesCommand = createTaxRatesCommand;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const sdk_ts_1 = require("@bigcapital/sdk-ts");
const config_1 = require("../config");
const errors_1 = require("../utils/errors");
const table_1 = require("../utils/table");
function createTaxRatesCommand() {
    const command = new commander_1.Command('tax-rates')
        .description('Manage tax rates');
    command
        .command('list')
        .description('List all tax rates')
        .action(async () => {
        const spinner = (0, ora_1.default)('Loading tax rates...').start();
        try {
            const fetcher = (0, config_1.createAuthenticatedFetcher)();
            const response = await (0, sdk_ts_1.fetchTaxRates)(fetcher);
            spinner.stop();
            const taxRates = response.taxRates;
            if (!taxRates || taxRates.length === 0) {
                console.log(chalk_1.default.yellow('No tax rates found.'));
                return;
            }
            const table = (0, table_1.createTable)(['ID', 'Name', 'Code', 'Rate', 'Status']);
            taxRates.forEach((tax) => {
                table.push([
                    tax.id,
                    tax.name || '-',
                    tax.code || '-',
                    `${tax.rate || 0}%`,
                    (0, table_1.formatStatus)(tax.active ? 'active' : 'inactive'),
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
