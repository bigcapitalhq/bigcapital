import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { fetchTaxRates } from '@bigcapital/sdk-ts';
import { createAuthenticatedFetcher } from '../config';
import { handleError } from '../utils/errors';
import { createTable, formatStatus } from '../utils/table';

export function createTaxRatesCommand(): Command {
  const command = new Command('tax-rates')
    .description('Manage tax rates');

  command
    .command('list')
    .description('List all tax rates')
    .action(async () => {
      const spinner = ora('Loading tax rates...').start();

      try {
        const fetcher = createAuthenticatedFetcher();
        const response = await fetchTaxRates(fetcher);

        spinner.stop();

        const taxRates = (response as unknown as { taxRates: Array<{
          id: number;
          name?: string;
          rate?: number;
          code?: string;
          active?: boolean;
        }> }).taxRates;

        if (!taxRates || taxRates.length === 0) {
          console.log(chalk.yellow('No tax rates found.'));
          return;
        }

        const table = createTable(['ID', 'Name', 'Code', 'Rate', 'Status']);

        taxRates.forEach((tax) => {
          table.push([
            tax.id,
            tax.name || '-',
            tax.code || '-',
            `${tax.rate || 0}%`,
            formatStatus(tax.active ? 'active' : 'inactive'),
          ]);
        });

        console.log(table.toString());
      } catch (error) {
        spinner.stop();
        handleError(error);
      }
    });

  return command;
}
