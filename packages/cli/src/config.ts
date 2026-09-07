import Conf from 'conf';
import chalk from 'chalk';
import { createApiFetcher, ApiFetcher } from '@bigcapital/sdk-ts';

interface ConfigSchema {
  apiKey: string;
  baseUrl: string;
  organizationId?: string;
}

const config = new Conf<ConfigSchema>({
  projectName: 'bigcapital',
  schema: {
    apiKey: {
      type: 'string',
    },
    baseUrl: {
      type: 'string',
    },
    organizationId: {
      type: 'string',
    },
  },
});

export function getConfig(): ConfigSchema {
  return {
    apiKey: config.get('apiKey', ''),
    baseUrl: config.get('baseUrl', ''),
    organizationId: config.get('organizationId'),
  };
}

export function setApiKey(apiKey: string): void {
  config.set('apiKey', apiKey);
}

export function setBaseUrl(baseUrl: string): void {
  // Remove trailing slash if present
  const normalizedUrl = baseUrl.replace(/\/$/, '');
  config.set('baseUrl', normalizedUrl);
}

export function setOrganizationId(organizationId: string): void {
  config.set('organizationId', organizationId);
}

export function validateConfig(): ConfigSchema {
  const currentConfig = getConfig();

  if (!currentConfig.apiKey) {
    console.error(chalk.red('Error: API key is not configured.'));
    console.error(chalk.yellow('Run: bigcapital config set api-key <your-api-key>'));
    process.exit(1);
  }

  if (!currentConfig.baseUrl) {
    console.error(chalk.red('Error: Base URL is not configured.'));
    console.error(chalk.yellow('Run: bigcapital config set base-url <https://your-api-url>'));
    process.exit(1);
  }

  return currentConfig;
}

export function createAuthenticatedFetcher(): ApiFetcher {
  const currentConfig = validateConfig();

  const headers: Record<string, string> = {
    'Authorization': `Bearer ${currentConfig.apiKey}`,
  };

  if (currentConfig.organizationId) {
    headers['organization-id'] = currentConfig.organizationId;
  }

  return createApiFetcher({
    baseUrl: currentConfig.baseUrl,
    init: {
      headers,
    },
  });
}
