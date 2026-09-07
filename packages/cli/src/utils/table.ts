import Table from 'cli-table3';
import chalk from 'chalk';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createTable(headers: string[]): Table.Table {
  return new Table({
    head: headers.map(h => chalk.cyan.bold(h)),
    style: {
      head: [],
      border: [],
    },
    chars: {
      top: '─',
      'top-mid': '┬',
      'top-left': '┌',
      'top-right': '┐',
      bottom: '─',
      'bottom-mid': '┴',
      'bottom-left': '└',
      'bottom-right': '┘',
      left: '│',
      'left-mid': '├',
      mid: '─',
      'mid-mid': '┼',
      right: '│',
      'right-mid': '┤',
      middle: '│',
    },
  });
}

export function formatCurrency(amount: number | string | undefined, currency = '$'): string {
  if (amount === undefined || amount === null) return '-';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '-';
  return `${currency}${num.toFixed(2)}`;
}

export function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function truncate(str: string | undefined, maxLength: number): string {
  if (!str) return '-';
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
}

export function formatStatus(status: string | undefined): string {
  if (!status) return '-';

  const statusColors: Record<string, (s: string) => string> = {
    published: chalk.green,
    draft: chalk.gray,
    delivered: chalk.blue,
    partial: chalk.yellow,
    paid: chalk.green.bold,
    unpaid: chalk.red,
    overdue: chalk.red.bold,
    active: chalk.green,
    inactive: chalk.gray,
  };

  const lowerStatus = status.toLowerCase();
  const colorFn = statusColors[lowerStatus] || chalk.white;
  return colorFn(status);
}
