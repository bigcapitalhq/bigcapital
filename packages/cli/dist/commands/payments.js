"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentsCommand = createPaymentsCommand;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const sdk_ts_1 = require("@bigcapital/sdk-ts");
const config_1 = require("../config");
const errors_1 = require("../utils/errors");
const table_1 = require("../utils/table");
function createPaymentsCommand() {
    const command = new commander_1.Command('payments')
        .description('Manage payments');
    command
        .command('received')
        .description('List payments received from customers')
        .action(async () => {
        const spinner = (0, ora_1.default)('Loading payments received...').start();
        try {
            const fetcher = (0, config_1.createAuthenticatedFetcher)();
            const response = await (0, sdk_ts_1.fetchPaymentsReceived)(fetcher);
            spinner.stop();
            const payments = response.paymentsReceived;
            if (!payments || payments.length === 0) {
                console.log(chalk_1.default.yellow('No payments received found.'));
                return;
            }
            const table = (0, table_1.createTable)(['ID', 'Customer', 'Date', 'Amount', 'Reference']);
            payments.forEach((payment) => {
                table.push([
                    payment.id,
                    (0, table_1.truncate)(payment.customer?.displayName, 25),
                    (0, table_1.formatDate)(payment.paymentDate),
                    (0, table_1.formatCurrency)(payment.amount),
                    payment.referenceNo || '-',
                ]);
            });
            console.log(table.toString());
        }
        catch (error) {
            spinner.stop();
            (0, errors_1.handleError)(error);
        }
    });
    command
        .command('made')
        .description('List bill payments made to vendors')
        .action(async () => {
        const spinner = (0, ora_1.default)('Loading payments made...').start();
        try {
            const fetcher = (0, config_1.createAuthenticatedFetcher)();
            const response = await (0, sdk_ts_1.fetchBillPayments)(fetcher);
            spinner.stop();
            const payments = response.billPayments;
            if (!payments || payments.length === 0) {
                console.log(chalk_1.default.yellow('No payments made found.'));
                return;
            }
            const table = (0, table_1.createTable)(['ID', 'Vendor', 'Date', 'Amount', 'Reference']);
            payments.forEach((payment) => {
                table.push([
                    payment.id,
                    (0, table_1.truncate)(payment.vendor?.displayName, 25),
                    (0, table_1.formatDate)(payment.paymentDate),
                    (0, table_1.formatCurrency)(payment.amount),
                    payment.referenceNo || '-',
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
