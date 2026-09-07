#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const items_1 = require("./commands/items");
const invoices_1 = require("./commands/invoices");
const config_1 = require("./commands/config");
const customers_1 = require("./commands/customers");
const vendors_1 = require("./commands/vendors");
const bills_1 = require("./commands/bills");
const accounts_1 = require("./commands/accounts");
const expenses_1 = require("./commands/expenses");
const credit_notes_1 = require("./commands/credit-notes");
const vendor_credits_1 = require("./commands/vendor-credits");
const payments_1 = require("./commands/payments");
const estimates_1 = require("./commands/estimates");
const receipts_1 = require("./commands/receipts");
const journals_1 = require("./commands/journals");
const inventory_1 = require("./commands/inventory");
const tax_rates_1 = require("./commands/tax-rates");
const warehouses_1 = require("./commands/warehouses");
const users_1 = require("./commands/users");
const reports_1 = require("./commands/reports");
const chalk_1 = __importDefault(require("chalk"));
const program = new commander_1.Command();
program
    .name('bigcapital')
    .description('Bigcapital CLI - Interact with Bigcapital API')
    .version('1.0.0')
    .configureOutput({
    writeErr: (str) => process.stderr.write(chalk_1.default.red(str)),
    outputError: (str, write) => write(chalk_1.default.red(str)),
});
// Core modules
program.addCommand((0, config_1.createConfigCommand)());
program.addCommand((0, items_1.createItemsCommand)());
program.addCommand((0, invoices_1.createInvoicesCommand)());
program.addCommand((0, customers_1.createCustomersCommand)());
program.addCommand((0, vendors_1.createVendorsCommand)());
program.addCommand((0, bills_1.createBillsCommand)());
// Additional transactional modules
program.addCommand((0, accounts_1.createAccountsCommand)());
program.addCommand((0, expenses_1.createExpensesCommand)());
program.addCommand((0, credit_notes_1.createCreditNotesCommand)());
program.addCommand((0, vendor_credits_1.createVendorCreditsCommand)());
program.addCommand((0, payments_1.createPaymentsCommand)());
program.addCommand((0, estimates_1.createEstimatesCommand)());
program.addCommand((0, receipts_1.createReceiptsCommand)());
program.addCommand((0, journals_1.createJournalsCommand)());
program.addCommand((0, inventory_1.createInventoryCommand)());
program.addCommand((0, tax_rates_1.createTaxRatesCommand)());
program.addCommand((0, warehouses_1.createWarehousesCommand)());
program.addCommand((0, users_1.createUsersCommand)());
// Financial reports
program.addCommand((0, reports_1.createReportsCommand)());
// Global error handling
program.hook('preAction', () => {
    process.on('unhandledRejection', (error) => {
        console.error(chalk_1.default.red('\nUnhandled error:'), error);
        process.exit(1);
    });
    process.on('uncaughtException', (error) => {
        console.error(chalk_1.default.red('\nUncaught exception:'), error);
        process.exit(1);
    });
});
// Show help if no command provided
if (process.argv.length <= 2) {
    program.help();
}
program.parse();
