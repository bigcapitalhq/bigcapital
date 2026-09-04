import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { fetchManualJournals } from '@bigcapital/sdk-ts';
import { createAuthenticatedFetcher } from '../config';
import { handleError } from '../utils/errors';
import { createTable, formatDate, truncate, formatStatus } from '../utils/table';

export function createJournalsCommand(): Command {
  const command = new Command('journals')
    .description('Manage manual journals');

  command
    .command('list')
    .description('List all manual journals')
    .option('-l, --limit <number>', 'Limit number of results per page', '50')
    .option('-p, --page <number>', 'Page number', '1')
    .action(async (options) => {
      const spinner = ora('Loading journals...').start();

      try {
        const fetcher = createAuthenticatedFetcher();

        const response = await fetchManualJournals(fetcher, {} as never);

        spinner.stop();

        const journals = (response as unknown as { manualJournals: Array<{
          id: number;
          journalNumber?: string;
          date?: string;
          reference?: string;
          description?: string;
          status?: string;
          amount?: number;
        }> }).manualJournals;

        if (!journals || journals.length === 0) {
          console.log(chalk.yellow('No manual journals found.'));
          return;
        }

        const pagination = (response as unknown as {
          pagination?: { total: number; page: number; pageSize?: number; page_size?: number }
        }).pagination;
        if (pagination) {
          const pageSize = pagination.pageSize || pagination.page_size || 10;
          const totalPages = Math.ceil(pagination.total / pageSize);
          console.log(chalk.gray(`\nPage ${pagination.page} of ${totalPages} (${pagination.total} total journals)\n`));
        }

        const table = createTable(['ID', 'Journal #', 'Date', 'Reference', 'Description', 'Amount', 'Status']);

        journals.forEach((journal) => {
          table.push([
            journal.id,
            journal.journalNumber || '-',
            formatDate(journal.date),
            journal.reference || '-',
            truncate(journal.description, 25),
            journal.amount?.toFixed(2) || '-',
            formatStatus(journal.status),
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
