"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = getConfig;
exports.setApiKey = setApiKey;
exports.setBaseUrl = setBaseUrl;
exports.setOrganizationId = setOrganizationId;
exports.validateConfig = validateConfig;
exports.createAuthenticatedFetcher = createAuthenticatedFetcher;
const conf_1 = __importDefault(require("conf"));
const chalk_1 = __importDefault(require("chalk"));
const sdk_ts_1 = require("@bigcapital/sdk-ts");
const config = new conf_1.default({
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
function getConfig() {
    return {
        apiKey: config.get('apiKey', ''),
        baseUrl: config.get('baseUrl', ''),
        organizationId: config.get('organizationId'),
    };
}
function setApiKey(apiKey) {
    config.set('apiKey', apiKey);
}
function setBaseUrl(baseUrl) {
    // Remove trailing slash if present
    const normalizedUrl = baseUrl.replace(/\/$/, '');
    config.set('baseUrl', normalizedUrl);
}
function setOrganizationId(organizationId) {
    config.set('organizationId', organizationId);
}
function validateConfig() {
    const currentConfig = getConfig();
    if (!currentConfig.apiKey) {
        console.error(chalk_1.default.red('Error: API key is not configured.'));
        console.error(chalk_1.default.yellow('Run: bigcapital config set api-key <your-api-key>'));
        process.exit(1);
    }
    if (!currentConfig.baseUrl) {
        console.error(chalk_1.default.red('Error: Base URL is not configured.'));
        console.error(chalk_1.default.yellow('Run: bigcapital config set base-url <https://your-api-url>'));
        process.exit(1);
    }
    return currentConfig;
}
function createAuthenticatedFetcher() {
    const currentConfig = validateConfig();
    const headers = {
        'Authorization': `Bearer ${currentConfig.apiKey}`,
    };
    if (currentConfig.organizationId) {
        headers['organization-id'] = currentConfig.organizationId;
    }
    return (0, sdk_ts_1.createApiFetcher)({
        baseUrl: currentConfig.baseUrl,
        init: {
            headers,
        },
    });
}
