import { Command } from 'commander';
import chalk from 'chalk';
import { getConfig, setApiKey, setBaseUrl, setOrganizationId } from '../config';

export function createConfigCommand(): Command {
  const command = new Command('config')
    .description('Manage CLI configuration');

  command
    .command('set')
    .description('Set a configuration value')
    .argument('<key>', 'Configuration key (api-key, base-url, organization-id)')
    .argument('<value>', 'Configuration value')
    .action((key: string, value: string) => {
      switch (key.toLowerCase()) {
        case 'api-key':
          setApiKey(value);
          console.log(chalk.green('✓ API key configured successfully'));
          break;
        case 'base-url':
          setBaseUrl(value);
          console.log(chalk.green('✓ Base URL configured successfully'));
          break;
        case 'organization-id':
          setOrganizationId(value);
          console.log(chalk.green('✓ Organization ID configured successfully'));
          break;
        default:
          console.error(chalk.red(`Error: Unknown configuration key "${key}"`));
          console.log(chalk.yellow('Valid keys: api-key, base-url, organization-id'));
          process.exit(1);
      }
    });

  command
    .command('get')
    .description('Show current configuration')
    .action(() => {
      const config = getConfig();

      console.log(chalk.bold('\nBigcapital CLI Configuration:'));
      console.log(chalk.gray('─'.repeat(50)));

      if (config.apiKey) {
        const maskedKey = config.apiKey.substring(0, 4) + '...' + config.apiKey.substring(config.apiKey.length - 4);
        console.log(`API Key:      ${chalk.green(maskedKey)}`);
      } else {
        console.log(`API Key:      ${chalk.yellow('Not set')}`);
      }

      if (config.baseUrl) {
        console.log(`Base URL:     ${chalk.green(config.baseUrl)}`);
      } else {
        console.log(`Base URL:     ${chalk.yellow('Not set')}`);
      }

      if (config.organizationId) {
        console.log(`Organization: ${chalk.green(config.organizationId)}`);
      } else {
        console.log(`Organization: ${chalk.yellow('Not set')} (optional)`);
      }

      console.log(chalk.gray('─'.repeat(50)));
      console.log(chalk.gray('\nConfig file location: ~/.config/bigcapital-nodejs/config.json\n'));
    });

  return command;
}
