#!/usr/bin/env node

import { Command } from 'commander';
import { createItemsCommand } from './commands/items';
import { createInvoicesCommand } from './commands/invoices';
import { createConfigCommand } from './commands/config';
import { createCustomersCommand } from './commands/customers';
import { createVendorsCommand } from './commands/vendors';
import { createBillsCommand } from './commands/bills';
import { createAccountsCommand } from './commands/accounts';
import { createExpensesCommand } from './commands/expenses';
import { createCreditNotesCommand } from './commands/credit-notes';
import { createVendorCreditsCommand } from './commands/vendor-credits';
import { createPaymentsCommand } from './commands/payments';
import { createEstimatesCommand } from './commands/estimates';
import { createReceiptsCommand } from './commands/receipts';
import { createJournalsCommand } from './commands/journals';
import { createInventoryCommand } from './commands/inventory';
import { createTaxRatesCommand } from './commands/tax-rates';
import { createWarehousesCommand } from './commands/warehouses';
import { createUsersCommand } from './commands/users';
import { createReportsCommand } from './commands/reports';
import chalk from 'chalk';

const program = new Command();

program
  .name('bigcapital')
  .description('Bigcapital CLI - Interact with Bigcapital API')
  .version('1.0.0')
  .configureOutput({
    writeErr: (str) => process.stderr.write(chalk.red(str)),
    outputError: (str, write) => write(chalk.red(str)),
  });

// Core modules
program.addCommand(createConfigCommand());
program.addCommand(createItemsCommand());
program.addCommand(createInvoicesCommand());
program.addCommand(createCustomersCommand());
program.addCommand(createVendorsCommand());
program.addCommand(createBillsCommand());

// Additional transactional modules
program.addCommand(createAccountsCommand());
program.addCommand(createExpensesCommand());
program.addCommand(createCreditNotesCommand());
program.addCommand(createVendorCreditsCommand());
program.addCommand(createPaymentsCommand());
program.addCommand(createEstimatesCommand());
program.addCommand(createReceiptsCommand());
program.addCommand(createJournalsCommand());
program.addCommand(createInventoryCommand());
program.addCommand(createTaxRatesCommand());
program.addCommand(createWarehousesCommand());
program.addCommand(createUsersCommand());

// Financial reports
program.addCommand(createReportsCommand());

// Global error handling
program.hook('preAction', () => {
  process.on('unhandledRejection', (error) => {
    console.error(chalk.red('\nUnhandled error:'), error);
    process.exit(1);
  });

  process.on('uncaughtException', (error) => {
    console.error(chalk.red('\nUncaught exception:'), error);
    process.exit(1);
  });
});

// Show help if no command provided
if (process.argv.length <= 2) {
  program.help();
}

program.parse();
