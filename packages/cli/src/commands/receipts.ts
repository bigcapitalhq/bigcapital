import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { fetchSaleReceipts } from '@bigcapital/sdk-ts';
import { createAuthenticatedFetcher } from '../config';
import { handleError } from '../utils/errors';
import { createTable, formatCurrency, formatDate, truncate, formatStatus } from '../utils/table';

export function createReceiptsCommand(): Command {
  const command = new Command('receipts')
    .description('Manage sale receipts');

  command
    .command('list')
    .description('List all sale receipts')
    .option('-l, --limit <number>', 'Limit number of results per page', '50')
    .option('-p, --page <number>', 'Page number', '1')
    .option('-c, --customer <id>', 'Filter by customer ID')
    .action(async (options) => {
      const spinner = ora('Loading receipts...').start();

      try {
        const fetcher = createAuthenticatedFetcher();

        const query = {
          page: parseInt(options.page, 10),
          pageSize: Math.min(parseInt(options.limit, 10), 100),
          ...(options.customer && { customerId: parseInt(options.customer, 10) }),
        };

        const response = await fetchSaleReceipts(fetcher, query);

        spinner.stop();

        const receipts = (response as unknown as { saleReceipts: Array<{
          id: number;
          receiptNumber?: string;
          customer?: { displayName?: string };
          receiptDate?: string;
          total?: number;
          status?: string;
        }> }).saleReceipts;

        if (!receipts || receipts.length === 0) {
          console.log(chalk.yellow('No receipts found.'));
          return;
        }

        const pagination = (response as unknown as {
          pagination?: { total: number; page: number; pageSize?: number; page_size?: number }
        }).pagination;
        if (pagination) {
          const pageSize = pagination.pageSize || pagination.page_size || 10;
          const totalPages = Math.ceil(pagination.total / pageSize);
          console.log(chalk.gray(`\nPage ${pagination.page} of ${totalPages} (${pagination.total} total receipts)\n`));
        }

        const table = createTable(['ID', 'Receipt #', 'Customer', 'Date', 'Total', 'Status']);

        receipts.forEach((receipt) => {
          table.push([
            receipt.id,
            receipt.receiptNumber || '-',
            truncate(receipt.customer?.displayName, 20),
            formatDate(receipt.receiptDate),
            formatCurrency(receipt.total),
            formatStatus(receipt.status),
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
