import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { fetchVendorCredits } from '@bigcapital/sdk-ts';
import { createAuthenticatedFetcher } from '../config';
import { handleError } from '../utils/errors';
import { createTable, formatCurrency, formatDate, truncate, formatStatus } from '../utils/table';

export function createVendorCreditsCommand(): Command {
  const command = new Command('vendor-credits')
    .description('Manage vendor credits');

  command
    .command('list')
    .description('List all vendor credits')
    .option('-l, --limit <number>', 'Limit number of results per page', '50')
    .option('-p, --page <number>', 'Page number', '1')
    .option('-v, --vendor <id>', 'Filter by vendor ID')
    .action(async (options) => {
      const spinner = ora('Loading vendor credits...').start();

      try {
        const fetcher = createAuthenticatedFetcher();

        const query = {
          page: parseInt(options.page, 10),
          pageSize: Math.min(parseInt(options.limit, 10), 100),
          ...(options.vendor && { vendorId: parseInt(options.vendor, 10) }),
        };

        const response = await fetchVendorCredits(fetcher, query);

        spinner.stop();

        const vendorCredits = (response as unknown as { vendorCredits: Array<{
          id: number;
          vendorCreditNumber?: string;
          vendor?: { displayName?: string };
          vendorCreditDate?: string;
          total?: number;
          balance?: number;
          status?: string;
        }> }).vendorCredits;

        if (!vendorCredits || vendorCredits.length === 0) {
          console.log(chalk.yellow('No vendor credits found.'));
          return;
        }

        const pagination = (response as unknown as {
          pagination?: { total: number; page: number; pageSize?: number; page_size?: number }
        }).pagination;
        if (pagination) {
          const pageSize = pagination.pageSize || pagination.page_size || 10;
          const totalPages = Math.ceil(pagination.total / pageSize);
          console.log(chalk.gray(`\nPage ${pagination.page} of ${totalPages} (${pagination.total} total vendor credits)\n`));
        }

        const table = createTable(['ID', 'VC #', 'Vendor', 'Date', 'Total', 'Balance', 'Status']);

        vendorCredits.forEach((vc) => {
          table.push([
            vc.id,
            vc.vendorCreditNumber || '-',
            truncate(vc.vendor?.displayName, 20),
            formatDate(vc.vendorCreditDate),
            formatCurrency(vc.total),
            formatCurrency(vc.balance),
            formatStatus(vc.status),
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
