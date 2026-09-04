import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { fetchAccounts } from '@bigcapital/sdk-ts';
import { createAuthenticatedFetcher } from '../config';
import { handleError } from '../utils/errors';
import { createTable, formatCurrency, truncate, formatStatus } from '../utils/table';

export function createAccountsCommand(): Command {
  const command = new Command('accounts')
    .description('Manage chart of accounts');

  command
    .command('list')
    .description('List all accounts')
    .option('-t, --type <type>', 'Filter by account type')
    .option('--active-only', 'Show only active accounts', false)
    .action(async (options) => {
      const spinner = ora('Loading accounts...').start();

      try {
        const fetcher = createAuthenticatedFetcher();

        const query = {
          ...(options.type && { type: options.type }),
          ...(options.activeOnly && { active: true }),
        };

        const accounts = await fetchAccounts(fetcher, query);

        spinner.stop();

        if (!accounts || accounts.length === 0) {
          console.log(chalk.yellow('No accounts found.'));
          return;
        }

        const table = createTable(['ID', 'Code', 'Name', 'Type', 'Balance', 'Status']);

        accounts.forEach((account: {
          id: number;
          code?: string;
          name?: string;
          accountType?: string;
          amount?: number;
          active?: boolean;
        }) => {
          table.push([
            account.id,
            account.code || '-',
            truncate(account.name, 30),
            account.accountType || '-',
            formatCurrency(account.amount),
            formatStatus(account.active ? 'active' : 'inactive'),
          ]);
        });

        console.log(table.toString());
        console.log(chalk.gray(`\nTotal accounts: ${accounts.length}`));
      } catch (error) {
        spinner.stop();
        handleError(error);
      }
    });

  return command;
}
