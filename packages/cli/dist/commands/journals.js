"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJournalsCommand = createJournalsCommand;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const sdk_ts_1 = require("@bigcapital/sdk-ts");
const config_1 = require("../config");
const errors_1 = require("../utils/errors");
const table_1 = require("../utils/table");
function createJournalsCommand() {
    const command = new commander_1.Command('journals')
        .description('Manage manual journals');
    command
        .command('list')
        .description('List all manual journals')
        .option('-l, --limit <number>', 'Limit number of results per page', '50')
        .option('-p, --page <number>', 'Page number', '1')
        .action(async (options) => {
        const spinner = (0, ora_1.default)('Loading journals...').start();
        try {
            const fetcher = (0, config_1.createAuthenticatedFetcher)();
            const response = await (0, sdk_ts_1.fetchManualJournals)(fetcher, {});
            spinner.stop();
            const journals = response.manualJournals;
            if (!journals || journals.length === 0) {
                console.log(chalk_1.default.yellow('No manual journals found.'));
                return;
            }
            const pagination = response.pagination;
            if (pagination) {
                const pageSize = pagination.pageSize || pagination.page_size || 10;
                const totalPages = Math.ceil(pagination.total / pageSize);
                console.log(chalk_1.default.gray(`\nPage ${pagination.page} of ${totalPages} (${pagination.total} total journals)\n`));
            }
            const table = (0, table_1.createTable)(['ID', 'Journal #', 'Date', 'Reference', 'Description', 'Amount', 'Status']);
            journals.forEach((journal) => {
                table.push([
                    journal.id,
                    journal.journalNumber || '-',
                    (0, table_1.formatDate)(journal.date),
                    journal.reference || '-',
                    (0, table_1.truncate)(journal.description, 25),
                    journal.amount?.toFixed(2) || '-',
                    (0, table_1.formatStatus)(journal.status),
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
