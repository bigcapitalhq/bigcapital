import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { fetchCreditNotes } from '@bigcapital/sdk-ts';
import { createAuthenticatedFetcher } from '../config';
import { handleError } from '../utils/errors';
import { createTable, formatCurrency, formatDate, truncate, formatStatus } from '../utils/table';

export function createCreditNotesCommand(): Command {
  const command = new Command('credit-notes')
    .description('Manage credit notes');

  command
    .command('list')
    .description('List all credit notes')
    .option('-l, --limit <number>', 'Limit number of results per page', '50')
    .option('-p, --page <number>', 'Page number', '1')
    .option('-c, --customer <id>', 'Filter by customer ID')
    .action(async (options) => {
      const spinner = ora('Loading credit notes...').start();

      try {
        const fetcher = createAuthenticatedFetcher();

        const query = {
          page: parseInt(options.page, 10),
          pageSize: Math.min(parseInt(options.limit, 10), 100),
          ...(options.customer && { customerId: parseInt(options.customer, 10) }),
        };

        const response = await fetchCreditNotes(fetcher, query);

        spinner.stop();

        const creditNotes = (response as unknown as { creditNotes: Array<{
          id: number;
          creditNoteNumber?: string;
          customer?: { displayName?: string };
          creditNoteDate?: string;
          total?: number;
          balance?: number;
          status?: string;
        }> }).creditNotes;

        if (!creditNotes || creditNotes.length === 0) {
          console.log(chalk.yellow('No credit notes found.'));
          return;
        }

        const pagination = (response as unknown as {
          pagination?: { total: number; page: number; pageSize?: number; page_size?: number }
        }).pagination;
        if (pagination) {
          const pageSize = pagination.pageSize || pagination.page_size || 10;
          const totalPages = Math.ceil(pagination.total / pageSize);
          console.log(chalk.gray(`\nPage ${pagination.page} of ${totalPages} (${pagination.total} total credit notes)\n`));
        }

        const table = createTable(['ID', 'CN #', 'Customer', 'Date', 'Total', 'Balance', 'Status']);

        creditNotes.forEach((cn) => {
          table.push([
            cn.id,
            cn.creditNoteNumber || '-',
            truncate(cn.customer?.displayName, 20),
            formatDate(cn.creditNoteDate),
            formatCurrency(cn.total),
            formatCurrency(cn.balance),
            formatStatus(cn.status),
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
