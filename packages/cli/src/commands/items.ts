import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { fetchItems } from '@bigcapital/sdk-ts';
import { createAuthenticatedFetcher } from '../config';
import { handleError } from '../utils/errors';
import { createTable, formatCurrency, truncate, formatStatus } from '../utils/table';

export function createItemsCommand(): Command {
  const command = new Command('items')
    .description('Manage items and products');

  command
    .command('list')
    .description('List all items/products')
    .option('-l, --limit <number>', 'Limit number of results per page', '50')
    .option('-p, --page <number>', 'Page number', '1')
    .option('-t, --type <type>', 'Filter by item type (inventory, service, product)')
    .option('--active-only', 'Show only active items', false)
    .action(async (options) => {
      const spinner = ora('Loading items...').start();

      try {
        const fetcher = createAuthenticatedFetcher();

        const query = {
          page: parseInt(options.page, 10),
          pageSize: Math.min(parseInt(options.limit, 10), 100),
          ...(options.type && { type: options.type }),
          ...(options.activeOnly && { active: true }),
        };

        const response = await fetchItems(fetcher, query);

        spinner.stop();

        // The response has 'items' array, not 'data'
        const items = (response as unknown as { items: Array<{
          id: number;
          name?: string;
          type?: string;
          sellPrice?: number;
          costPrice?: number;
          quantityOnHand?: number;
          active?: boolean;
        }> }).items;

        if (!items || items.length === 0) {
          console.log(chalk.yellow('No items found.'));
          return;
        }

        // Pagination info
        const pagination = (response as unknown as {
          pagination?: { total: number; page: number; pageSize?: number; page_size?: number }
        }).pagination;
        if (pagination) {
          const pageSize = pagination.pageSize || pagination.page_size || 10;
          const totalPages = Math.ceil(pagination.total / pageSize);
          console.log(chalk.gray(`\nPage ${pagination.page} of ${totalPages} (${pagination.total} total items)\n`));
        }

        // Create table
        const table = createTable(['ID', 'Name', 'Type', 'Sell Price', 'Cost Price', 'Qty', 'Status']);

        items.forEach((item) => {
          table.push([
            item.id,
            truncate(item.name, 30),
            item.type || '-',
            formatCurrency(item.sellPrice),
            formatCurrency(item.costPrice),
            item.quantityOnHand ?? '-',
            formatStatus(item.active ? 'active' : 'inactive'),
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
