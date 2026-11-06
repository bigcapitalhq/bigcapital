import { Command } from 'commander';
import { version } from '../package.json';
import { registerCommands } from './commands';
import { CliError } from './errors';

const program = new Command();

program
  .name('bigcapital-extensions')
  .description(
    'Manage deploy-time Bigcapital extensions, the lockfile, and generated imports.',
  )
  .version(version);

registerCommands(program);

program.parseAsync(process.argv).catch((error: unknown) => {
  if (error instanceof CliError) {
    console.error(`\n${error.message}`);

    error.details.forEach((detail) => {
      console.error(`  - ${detail}`);
    });
  } else {
    console.error(error);
  }

  process.exitCode = 1;
});
