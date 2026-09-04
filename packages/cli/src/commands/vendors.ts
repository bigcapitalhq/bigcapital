import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { fetchVendors } from '@bigcapital/sdk-ts';
import { createAuthenticatedFetcher } from '../config';
import { handleError } from '../utils/errors';
import { createTable, formatCurrency, truncate, formatStatus } from '../utils/table';

export function createVendorsCommand(): Command {
  const command = new Command('vendors')
    .description('Manage vendors');

  command
    .command('list')
    .description('List all vendors')
    .option('-l, --limit <number>', 'Limit number of results per page', '50')
    .option('-p, --page <number>', 'Page number', '1')
    .option('--active-only', 'Show only active vendors', false)
    .action(async (options) => {
      const spinner = ora('Loading vendors...').start();

      try {
        const fetcher = createAuthenticatedFetcher();

        const query = {
          page: parseInt(options.page, 10),
          pageSize: Math.min(parseInt(options.limit, 10), 100),
          ...(options.activeOnly && { active: true }),
        };

        const response = await fetchVendors(fetcher, query);

        spinner.stop();

        const vendors = (response as unknown as { vendors: Array<{
          id: number;
          displayName?: string;
          email?: string;
          workPhone?: string;
          personalPhone?: string;
          balance?: number;
          active?: boolean;
        }> }).vendors;

        if (!vendors || vendors.length === 0) {
          console.log(chalk.yellow('No vendors found.'));
          return;
        }

        const pagination = (response as unknown as {
          pagination?: { total: number; page: number; pageSize?: number; page_size?: number }
        }).pagination;
        if (pagination) {
          const pageSize = pagination.pageSize || pagination.page_size || 10;
          const totalPages = Math.ceil(pagination.total / pageSize);
          console.log(chalk.gray(`\nPage ${pagination.page} of ${totalPages} (${pagination.total} total vendors)\n`));
        }

        const table = createTable(['ID', 'Name', 'Email', 'Work Phone', 'Personal Phone', 'Balance', 'Status']);

        vendors.forEach((vendor) => {
          table.push([
            vendor.id,
            truncate(vendor.displayName, 25),
            truncate(vendor.email, 25) || '-',
            vendor.workPhone || '-',
            vendor.personalPhone || '-',
            formatCurrency(vendor.balance),
            formatStatus(vendor.active ? 'active' : 'inactive'),
          ]);
        });

        console.log(table.toString());

        if (pagination) {
          const pageSize = pagination.pageSize || pagination.page_size || 10;
          const totalPages = Math.ceil(pagination.total / pageSize);
          if (pagination.page < totalPages) {
            console.log(chalk.gray(`\nUse --page ${pagination.page + 1} to see more results`));
          }
        }
      } catch (error) {
        spinner.stop();
        handleError(error);
      }
    });

  return command;
}
