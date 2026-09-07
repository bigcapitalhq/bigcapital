import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { fetchExpenses } from '@bigcapital/sdk-ts';
import { createAuthenticatedFetcher } from '../config';
import { handleError } from '../utils/errors';
import { createTable, formatCurrency, formatDate, truncate, formatStatus } from '../utils/table';

export function createExpensesCommand(): Command {
  const command = new Command('expenses')
    .description('Manage expenses');

  command
    .command('list')
    .description('List all expenses')
    .option('-l, --limit <number>', 'Limit number of results per page', '50')
    .option('-p, --page <number>', 'Page number', '1')
    .option('--active-only', 'Show only active expenses', false)
    .action(async (options) => {
      const spinner = ora('Loading expenses...').start();

      try {
        const fetcher = createAuthenticatedFetcher();

        const query = {
          page: parseInt(options.page, 10),
          pageSize: Math.min(parseInt(options.limit, 10), 100),
          ...(options.activeOnly && { active: true }),
        };

        const response = await fetchExpenses(fetcher, query);

        spinner.stop();

        const expenses = (response as unknown as { expenses: Array<{
          id: number;
          paymentDate?: string;
          description?: string;
          total?: number;
          status?: string;
          active?: boolean;
        }> }).expenses;

        if (!expenses || expenses.length === 0) {
          console.log(chalk.yellow('No expenses found.'));
          return;
        }

        const pagination = (response as unknown as {
          pagination?: { total: number; page: number; pageSize?: number; page_size?: number }
        }).pagination;
        if (pagination) {
          const pageSize = pagination.pageSize || pagination.page_size || 10;
          const totalPages = Math.ceil(pagination.total / pageSize);
          console.log(chalk.gray(`\nPage ${pagination.page} of ${totalPages} (${pagination.total} total expenses)\n`));
        }

        const table = createTable(['ID', 'Date', 'Description', 'Total', 'Status']);

        expenses.forEach((expense) => {
          table.push([
            expense.id,
            formatDate(expense.paymentDate),
            truncate(expense.description, 35),
            formatCurrency(expense.total),
            formatStatus(expense.status),
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
