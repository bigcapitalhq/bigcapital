"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccountsCommand = createAccountsCommand;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const sdk_ts_1 = require("@bigcapital/sdk-ts");
const config_1 = require("../config");
const errors_1 = require("../utils/errors");
const table_1 = require("../utils/table");
function createAccountsCommand() {
    const command = new commander_1.Command('accounts')
        .description('Manage chart of accounts');
    command
        .command('list')
        .description('List all accounts')
        .option('-t, --type <type>', 'Filter by account type')
        .option('--active-only', 'Show only active accounts', false)
        .action(async (options) => {
        const spinner = (0, ora_1.default)('Loading accounts...').start();
        try {
            const fetcher = (0, config_1.createAuthenticatedFetcher)();
            const query = {
                ...(options.type && { type: options.type }),
                ...(options.activeOnly && { active: true }),
            };
            const accounts = await (0, sdk_ts_1.fetchAccounts)(fetcher, query);
            spinner.stop();
            if (!accounts || accounts.length === 0) {
                console.log(chalk_1.default.yellow('No accounts found.'));
                return;
            }
            const table = (0, table_1.createTable)(['ID', 'Code', 'Name', 'Type', 'Balance', 'Status']);
            accounts.forEach((account) => {
                table.push([
                    account.id,
                    account.code || '-',
                    (0, table_1.truncate)(account.name, 30),
                    account.accountType || '-',
                    (0, table_1.formatCurrency)(account.amount),
                    (0, table_1.formatStatus)(account.active ? 'active' : 'inactive'),
                ]);
            });
            console.log(table.toString());
            console.log(chalk_1.default.gray(`\nTotal accounts: ${accounts.length}`));
        }
        catch (error) {
            spinner.stop();
            (0, errors_1.handleError)(error);
        }
    });
    return command;
}
