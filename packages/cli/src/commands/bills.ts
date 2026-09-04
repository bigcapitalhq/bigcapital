import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { fetchBills } from '@bigcapital/sdk-ts';
import { createAuthenticatedFetcher } from '../config';
import { handleError } from '../utils/errors';
import { createTable, formatCurrency, formatDate, truncate, formatStatus } from '../utils/table';

export function createBillsCommand(): Command {
  const command = new Command('bills')
    .description('Manage bills');

  command
    .command('list')
    .description('List all bills')
    .option('-l, --limit <number>', 'Limit number of results per page', '50')
    .option('-p, --page <number>', 'Page number', '1')
    .option('-v, --vendor <id>', 'Filter by vendor ID')
    .option('-s, --status <status>', 'Filter by status (draft, published, paid, partial)')
    .action(async (options) => {
      const spinner = ora('Loading bills...').start();

      try {
        const fetcher = createAuthenticatedFetcher();

        const query = {
          page: parseInt(options.page, 10),
          pageSize: Math.min(parseInt(options.limit, 10), 100),
          ...(options.vendor && { vendorId: parseInt(options.vendor, 10) }),
          ...(options.status && { status: options.status }),
        };

        const response = await fetchBills(fetcher, query);

        spinner.stop();

        const bills = (response as unknown as { bills: Array<{
          id: number;
          billNumber?: string;
          vendor?: { displayName?: string };
          billDate?: string;
          dueDate?: string;
          total?: number;
          balance?: number;
          status?: string;
        }> }).bills;

        if (!bills || bills.length === 0) {
          console.log(chalk.yellow('No bills found.'));
          return;
        }

        const pagination = (response as unknown as {
          pagination?: { total: number; page: number; pageSize?: number; page_size?: number }
        }).pagination;
        if (pagination) {
          const pageSize = pagination.pageSize || pagination.page_size || 10;
          const totalPages = Math.ceil(pagination.total / pageSize);
          console.log(chalk.gray(`\nPage ${pagination.page} of ${totalPages} (${pagination.total} total bills)\n`));
        }

        const table = createTable(['ID', 'Bill #', 'Vendor', 'Date', 'Due Date', 'Total', 'Balance', 'Status']);

        bills.forEach((bill) => {
          table.push([
            bill.id,
            bill.billNumber || '-',
            truncate(bill.vendor?.displayName, 20),
            formatDate(bill.billDate),
            formatDate(bill.dueDate),
            formatCurrency(bill.total),
            formatCurrency(bill.balance),
            formatStatus(bill.status),
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
