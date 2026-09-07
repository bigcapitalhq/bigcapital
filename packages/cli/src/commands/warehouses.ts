import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { fetchWarehouses } from '@bigcapital/sdk-ts';
import { createAuthenticatedFetcher } from '../config';
import { handleError } from '../utils/errors';
import { createTable, formatStatus } from '../utils/table';

export function createWarehousesCommand(): Command {
  const command = new Command('warehouses')
    .description('Manage warehouses');

  command
    .command('list')
    .description('List all warehouses')
    .action(async () => {
      const spinner = ora('Loading warehouses...').start();

      try {
        const fetcher = createAuthenticatedFetcher();
        const response = await fetchWarehouses(fetcher);

        spinner.stop();

        const warehouses = (response as unknown as { warehouses: Array<{
          id: string;
          name?: string;
          code?: string;
          address?: string;
          city?: string;
          active?: boolean;
        }> }).warehouses;

        if (!warehouses || warehouses.length === 0) {
          console.log(chalk.yellow('No warehouses found.'));
          return;
        }

        const table = createTable(['ID', 'Code', 'Name', 'City', 'Status']);

        warehouses.forEach((warehouse) => {
          table.push([
            warehouse.id,
            warehouse.code || '-',
            warehouse.name || '-',
            warehouse.city || '-',
            formatStatus(warehouse.active ? 'active' : 'inactive'),
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
