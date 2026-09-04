import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { fetchInventoryAdjustments, fetchWarehouseTransfers } from '@bigcapital/sdk-ts';
import { createAuthenticatedFetcher } from '../config';
import { handleError } from '../utils/errors';
import { createTable, formatDate, formatStatus, truncate } from '../utils/table';

export function createInventoryCommand(): Command {
  const command = new Command('inventory')
    .description('Manage inventory');

  command
    .command('adjustments')
    .description('List inventory adjustments')
    .option('-l, --limit <number>', 'Limit number of results per page', '50')
    .option('-p, --page <number>', 'Page number', '1')
    .action(async (options) => {
      const spinner = ora('Loading inventory adjustments...').start();

      try {
        const fetcher = createAuthenticatedFetcher();

        const query = {
          page: parseInt(options.page, 10),
          pageSize: Math.min(parseInt(options.limit, 10), 100),
        };

        const response = await fetchInventoryAdjustments(fetcher, query);

        spinner.stop();

        const adjustments = (response as unknown as { inventoryAdjustments: Array<{
          id: number;
          adjustmentDate?: string;
          referenceNo?: string;
          reason?: string;
          status?: string;
        }> }).inventoryAdjustments;

        if (!adjustments || adjustments.length === 0) {
          console.log(chalk.yellow('No inventory adjustments found.'));
          return;
        }

        const pagination = (response as unknown as {
          pagination?: { total: number; page: number; pageSize?: number; page_size?: number }
        }).pagination;
        if (pagination) {
          const pageSize = pagination.pageSize || pagination.page_size || 10;
          const totalPages = Math.ceil(pagination.total / pageSize);
          console.log(chalk.gray(`\nPage ${pagination.page} of ${totalPages} (${pagination.total} total adjustments)\n`));
        }

        const table = createTable(['ID', 'Date', 'Reference', 'Reason', 'Status']);

        adjustments.forEach((adj) => {
          table.push([
            adj.id,
            formatDate(adj.adjustmentDate),
            adj.referenceNo || '-',
            truncate(adj.reason, 30),
            formatStatus(adj.status),
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

  command
    .command('transfers')
    .description('List warehouse transfers')
    .option('-l, --limit <number>', 'Limit number of results per page', '50')
    .option('-p, --page <number>', 'Page number', '1')
    .action(async (options) => {
      const spinner = ora('Loading warehouse transfers...').start();

      try {
        const fetcher = createAuthenticatedFetcher();

        const query = {
          page: parseInt(options.page, 10),
          pageSize: Math.min(parseInt(options.limit, 10), 100),
        };

        const response = await fetchWarehouseTransfers(fetcher, query);

        spinner.stop();

        const transfers = (response as unknown as { warehouseTransfers: Array<{
          id: number;
          date?: string;
          referenceNo?: string;
          fromWarehouse?: { name?: string };
          toWarehouse?: { name?: string };
          status?: string;
        }> }).warehouseTransfers;

        if (!transfers || transfers.length === 0) {
          console.log(chalk.yellow('No warehouse transfers found.'));
          return;
        }

        const pagination = (response as unknown as {
          pagination?: { total: number; page: number; pageSize?: number; page_size?: number }
        }).pagination;
        if (pagination) {
          const pageSize = pagination.pageSize || pagination.page_size || 10;
          const totalPages = Math.ceil(pagination.total / pageSize);
          console.log(chalk.gray(`\nPage ${pagination.page} of ${totalPages} (${pagination.total} total transfers)\n`));
        }

        const table = createTable(['ID', 'Date', 'Reference', 'From', 'To', 'Status']);

        transfers.forEach((transfer) => {
          table.push([
            transfer.id,
            formatDate(transfer.date),
            transfer.referenceNo || '-',
            truncate(transfer.fromWarehouse?.name, 15),
            truncate(transfer.toWarehouse?.name, 15),
            formatStatus(transfer.status),
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
