"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfigCommand = createConfigCommand;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const config_1 = require("../config");
function createConfigCommand() {
    const command = new commander_1.Command('config')
        .description('Manage CLI configuration');
    command
        .command('set')
        .description('Set a configuration value')
        .argument('<key>', 'Configuration key (api-key, base-url, organization-id)')
        .argument('<value>', 'Configuration value')
        .action((key, value) => {
        switch (key.toLowerCase()) {
            case 'api-key':
                (0, config_1.setApiKey)(value);
                console.log(chalk_1.default.green('✓ API key configured successfully'));
                break;
            case 'base-url':
                (0, config_1.setBaseUrl)(value);
                console.log(chalk_1.default.green('✓ Base URL configured successfully'));
                break;
            case 'organization-id':
                (0, config_1.setOrganizationId)(value);
                console.log(chalk_1.default.green('✓ Organization ID configured successfully'));
                break;
            default:
                console.error(chalk_1.default.red(`Error: Unknown configuration key "${key}"`));
                console.log(chalk_1.default.yellow('Valid keys: api-key, base-url, organization-id'));
                process.exit(1);
        }
    });
    command
        .command('get')
        .description('Show current configuration')
        .action(() => {
        const config = (0, config_1.getConfig)();
        console.log(chalk_1.default.bold('\nBigcapital CLI Configuration:'));
        console.log(chalk_1.default.gray('─'.repeat(50)));
        if (config.apiKey) {
            const maskedKey = config.apiKey.substring(0, 4) + '...' + config.apiKey.substring(config.apiKey.length - 4);
            console.log(`API Key:      ${chalk_1.default.green(maskedKey)}`);
        }
        else {
            console.log(`API Key:      ${chalk_1.default.yellow('Not set')}`);
        }
        if (config.baseUrl) {
            console.log(`Base URL:     ${chalk_1.default.green(config.baseUrl)}`);
        }
        else {
            console.log(`Base URL:     ${chalk_1.default.yellow('Not set')}`);
        }
        if (config.organizationId) {
            console.log(`Organization: ${chalk_1.default.green(config.organizationId)}`);
        }
        else {
            console.log(`Organization: ${chalk_1.default.yellow('Not set')} (optional)`);
        }
        console.log(chalk_1.default.gray('─'.repeat(50)));
        console.log(chalk_1.default.gray('\nConfig file location: ~/.config/bigcapital-nodejs/config.json\n'));
    });
    return command;
}
