import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { fetchSaleInvoices } from '@bigcapital/sdk-ts';
import { createAuthenticatedFetcher } from '../config';
import { handleError } from '../utils/errors';
import { createTable, formatCurrency, formatDate, truncate, formatStatus } from '../utils/table';

export function createInvoicesCommand(): Command {
  const command = new Command('invoices')
    .description('Manage sale invoices');

  command
    .command('list')
    .description('List all sale invoices')
    .option('-l, --limit <number>', 'Limit number of results per page', '50')
    .option('-p, --page <number>', 'Page number', '1')
    .option('-c, --customer <id>', 'Filter by customer ID')
    .option('-s, --status <status>', 'Filter by status (draft, published, paid, partial, overdue)')
    .action(async (options) => {
      const spinner = ora('Loading invoices...').start();

      try {
        const fetcher = createAuthenticatedFetcher();

        const query = {
          page: parseInt(options.page, 10),
          pageSize: Math.min(parseInt(options.limit, 10), 100),
          ...(options.customer && { customerId: parseInt(options.customer, 10) }),
          ...(options.status && { status: options.status }),
        };

        const response = await fetchSaleInvoices(fetcher, query);

        spinner.stop();

        // The response has 'salesInvoices' array (camelCase from middleware), not 'data'
        const invoices = (response as unknown as { salesInvoices: Array<{
          id: number;
          invoiceNo?: string;
          customer?: { displayName?: string };
          invoiceDate?: string;
          total?: number;
          balance?: number;
          status?: string;
        }> }).salesInvoices;

        if (!invoices || invoices.length === 0) {
          console.log(chalk.yellow('No invoices found.'));
          return;
        }

        // Pagination info
        const pagination = (response as unknown as {
          pagination?: { total: number; page: number; pageSize?: number; page_size?: number }
        }).pagination;
        if (pagination) {
          const pageSize = pagination.pageSize || pagination.page_size || 10;
          const totalPages = Math.ceil(pagination.total / pageSize);
          console.log(chalk.gray(`\nPage ${pagination.page} of ${totalPages} (${pagination.total} total invoices)\n`));
        }

        // Create table
        const table = createTable(['ID', 'Invoice #', 'Customer', 'Date', 'Total', 'Balance', 'Status']);

        invoices.forEach((invoice) => {
          table.push([
            invoice.id,
            invoice.invoiceNo || '-',
            truncate(invoice.customer?.displayName, 25),
            formatDate(invoice.invoiceDate),
            formatCurrency(invoice.total),
            formatCurrency(invoice.balance),
            formatStatus(invoice.status),
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
