import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { fetchPaymentsReceived, fetchBillPayments } from '@bigcapital/sdk-ts';
import { createAuthenticatedFetcher } from '../config';
import { handleError } from '../utils/errors';
import { createTable, formatCurrency, formatDate, truncate } from '../utils/table';

export function createPaymentsCommand(): Command {
  const command = new Command('payments')
    .description('Manage payments');

  command
    .command('received')
    .description('List payments received from customers')
    .action(async () => {
      const spinner = ora('Loading payments received...').start();

      try {
        const fetcher = createAuthenticatedFetcher();
        const response = await fetchPaymentsReceived(fetcher);

        spinner.stop();

        const payments = (response as unknown as { paymentsReceived: Array<{
          id: number;
          customer?: { displayName?: string };
          paymentDate?: string;
          amount?: number;
          referenceNo?: string;
        }> }).paymentsReceived;

        if (!payments || payments.length === 0) {
          console.log(chalk.yellow('No payments received found.'));
          return;
        }

        const table = createTable(['ID', 'Customer', 'Date', 'Amount', 'Reference']);

        payments.forEach((payment) => {
          table.push([
            payment.id,
            truncate(payment.customer?.displayName, 25),
            formatDate(payment.paymentDate),
            formatCurrency(payment.amount),
            payment.referenceNo || '-',
          ]);
        });

        console.log(table.toString());
      } catch (error) {
        spinner.stop();
        handleError(error);
      }
    });

  command
    .command('made')
    .description('List bill payments made to vendors')
    .action(async () => {
      const spinner = ora('Loading payments made...').start();

      try {
        const fetcher = createAuthenticatedFetcher();
        const response = await fetchBillPayments(fetcher);

        spinner.stop();

        const payments = (response as unknown as { billPayments: Array<{
          id: number;
          vendor?: { displayName?: string };
          paymentDate?: string;
          amount?: number;
          referenceNo?: string;
        }> }).billPayments;

        if (!payments || payments.length === 0) {
          console.log(chalk.yellow('No payments made found.'));
          return;
        }

        const table = createTable(['ID', 'Vendor', 'Date', 'Amount', 'Reference']);

        payments.forEach((payment) => {
          table.push([
            payment.id,
            truncate(payment.vendor?.displayName, 25),
            formatDate(payment.paymentDate),
            formatCurrency(payment.amount),
            payment.referenceNo || '-',
          ]);
        });

        console.log(table.toString());
      } catch (error) {
        spinner.stop();
        handleError(error);
      }
    });

  return command;
}
