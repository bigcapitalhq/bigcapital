"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCreditNotesCommand = createCreditNotesCommand;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const sdk_ts_1 = require("@bigcapital/sdk-ts");
const config_1 = require("../config");
const errors_1 = require("../utils/errors");
const table_1 = require("../utils/table");
function createCreditNotesCommand() {
    const command = new commander_1.Command('credit-notes')
        .description('Manage credit notes');
    command
        .command('list')
        .description('List all credit notes')
        .option('-l, --limit <number>', 'Limit number of results per page', '50')
        .option('-p, --page <number>', 'Page number', '1')
        .option('-c, --customer <id>', 'Filter by customer ID')
        .action(async (options) => {
        const spinner = (0, ora_1.default)('Loading credit notes...').start();
        try {
            const fetcher = (0, config_1.createAuthenticatedFetcher)();
            const query = {
                page: parseInt(options.page, 10),
                pageSize: Math.min(parseInt(options.limit, 10), 100),
                ...(options.customer && { customerId: parseInt(options.customer, 10) }),
            };
            const response = await (0, sdk_ts_1.fetchCreditNotes)(fetcher, query);
            spinner.stop();
            const creditNotes = response.creditNotes;
            if (!creditNotes || creditNotes.length === 0) {
                console.log(chalk_1.default.yellow('No credit notes found.'));
                return;
            }
            const pagination = response.pagination;
            if (pagination) {
                const pageSize = pagination.pageSize || pagination.page_size || 10;
                const totalPages = Math.ceil(pagination.total / pageSize);
                console.log(chalk_1.default.gray(`\nPage ${pagination.page} of ${totalPages} (${pagination.total} total credit notes)\n`));
            }
            const table = (0, table_1.createTable)(['ID', 'CN #', 'Customer', 'Date', 'Total', 'Balance', 'Status']);
            creditNotes.forEach((cn) => {
                table.push([
                    cn.id,
                    cn.creditNoteNumber || '-',
                    (0, table_1.truncate)(cn.customer?.displayName, 20),
                    (0, table_1.formatDate)(cn.creditNoteDate),
                    (0, table_1.formatCurrency)(cn.total),
                    (0, table_1.formatCurrency)(cn.balance),
                    (0, table_1.formatStatus)(cn.status),
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
