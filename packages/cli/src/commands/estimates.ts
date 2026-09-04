import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { fetchSaleEstimates } from '@bigcapital/sdk-ts';
import { createAuthenticatedFetcher } from '../config';
import { handleError } from '../utils/errors';
import { createTable, formatCurrency, formatDate, truncate, formatStatus } from '../utils/table';

export function createEstimatesCommand(): Command {
  const command = new Command('estimates')
    .description('Manage sale estimates/quotes');

  command
    .command('list')
    .description('List all sale estimates')
    .option('-l, --limit <number>', 'Limit number of results per page', '50')
    .option('-p, --page <number>', 'Page number', '1')
    .option('-c, --customer <id>', 'Filter by customer ID')
    .option('-s, --status <status>', 'Filter by status (draft, published)')
    .action(async (options) => {
      const spinner = ora('Loading estimates...').start();

      try {
        const fetcher = createAuthenticatedFetcher();

        const query = {
          page: parseInt(options.page, 10),
          pageSize: Math.min(parseInt(options.limit, 10), 100),
          ...(options.customer && { customerId: parseInt(options.customer, 10) }),
          ...(options.status && { status: options.status }),
        };

        const response = await fetchSaleEstimates(fetcher, query);

        spinner.stop();

        const estimates = (response as unknown as { saleEstimates: Array<{
          id: number;
          estimateNumber?: string;
          customer?: { displayName?: string };
          estimateDate?: string;
          expirationDate?: string;
          total?: number;
          status?: string;
        }> }).saleEstimates;

        if (!estimates || estimates.length === 0) {
          console.log(chalk.yellow('No estimates found.'));
          return;
        }

        const pagination = (response as unknown as {
          pagination?: { total: number; page: number; pageSize?: number; page_size?: number }
        }).pagination;
        if (pagination) {
          const pageSize = pagination.pageSize || pagination.page_size || 10;
          const totalPages = Math.ceil(pagination.total / pageSize);
          console.log(chalk.gray(`\nPage ${pagination.page} of ${totalPages} (${pagination.total} total estimates)\n`));
        }

        const table = createTable(['ID', 'Estimate #', 'Customer', 'Date', 'Expires', 'Total', 'Status']);

        estimates.forEach((estimate) => {
          table.push([
            estimate.id,
            estimate.estimateNumber || '-',
            truncate(estimate.customer?.displayName, 20),
            formatDate(estimate.estimateDate),
            formatDate(estimate.expirationDate),
            formatCurrency(estimate.total),
            formatStatus(estimate.status),
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
