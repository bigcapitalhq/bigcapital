import chalk from 'chalk';

export function handleError(error: unknown): never {
  if (error instanceof Error) {
    // Check if it's an HTTP error from the SDK
    const httpError = error as { status?: number; statusText?: string };

    if (httpError.status) {
      console.error(chalk.red(`HTTP Error ${httpError.status}: ${httpError.statusText || error.message}`));

      if (httpError.status === 401) {
        console.error(chalk.yellow('Your API key may be invalid or expired.'));
        console.error(chalk.yellow('Run: bigcapital config set api-key <your-new-api-key>'));
      } else if (httpError.status === 403) {
        console.error(chalk.yellow('You don\'t have permission to access this resource.'));
      } else if (httpError.status === 404) {
        console.error(chalk.yellow('The requested resource was not found.'));
      }
    } else {
      console.error(chalk.red(`Error: ${error.message}`));
    }

    if (process.env.DEBUG) {
      console.error(chalk.gray(error.stack));
    }
  } else {
    console.error(chalk.red('An unknown error occurred'));
    console.error(error);
  }

  process.exit(1);
}

export function assertDefined<T>(value: T | undefined | null, name: string): T {
  if (value === undefined || value === null) {
    console.error(chalk.red(`Error: ${name} is required but was not provided.`));
    process.exit(1);
  }
  return value;
}
