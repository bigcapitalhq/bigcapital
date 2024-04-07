const dotenv = require('dotenv');
const toInteger = require('lodash/toInteger');

const castCommaListEnvVarToArray = require('@/utils').castCommaListEnvVarToArray;
const parseBoolean = require('@/utils').parseBoolean;
const path = require('node:path');

dotenv.config();

const API_RATE_LIMIT = process.env.API_RATE_LIMIT?.split(',') || [];

process.env.APP_ROOT_DIR = path.join(__dirname, '..');
process.env.APP_RESOURCES_DIR = path.join(process.env.APP_ROOT_DIR, 'resources');
process.env.APP_LOCALES_DIR = path.join(process.env.APP_RESOURCES_DIR, 'locales');
process.env.APP_VIEWS_DIR = path.join(process.env.APP_ROOT_DIR, 'views');
process.env.APP_STORAGE_DIR = path.join(process.env.APP_ROOT_DIR, 'storage');

console.log('APP_ROOT_DIR:', process.env.APP_ROOT_DIR);
console.log('APP_RESOURCES_DIR:', process.env.APP_RESOURCES_DIR);
console.log('APP_LOCALES_DIR:', process.env.APP_LOCALES_DIR);
console.log('APP_VIEWS_DIR:', process.env.APP_VIEWS_DIR);
console.log('APP_STORAGE_DIR:', process.env.APP_STORAGE_DIR);

module.exports = {
  /**
   * Your favorite port
   */
  port: Number.parseInt(process.env.PORT || '3000', 10),

  /**
   * System database configuration.
   */
  system: {
    db_client: process.env.SYSTEM_DB_CLIENT || process.env.DB_CLIENT || 'mysql',
    db_host: process.env.SYSTEM_DB_HOST || process.env.DB_HOST,
    db_user: process.env.SYSTEM_DB_USER || process.env.DB_USER,
    db_password: process.env.SYSTEM_DB_PASSWORD || process.env.DB_PASSWORD,
    db_name: process.env.SYSTEM_DB_NAME,
    charset: process.env.SYSTEM_DB_CHARSET || process.env.DB_CHARSET,
    migrations_dir: path.join(process.env.APP_ROOT_DIR, './src/system/migrations'),
    seeds_dir: path.join(process.env.APP_ROOT_DIR, './src/system/seeds'),
  },

  /**
   * Tenant database configuration.
   */
  tenant: {
    db_client: process.env.TENANT_DB_CLIENT || process.env.DB_CLIENT || 'mysql',
    db_name_prefix: process.env.TENANT_DB_NAME_PERFIX,
    db_host: process.env.TENANT_DB_HOST || process.env.DB_HOST,
    db_user: process.env.TENANT_DB_USER || process.env.DB_USER,
    db_password: process.env.TENANT_DB_PASSWORD || process.env.DB_PASSWORD,
    charset: process.env.TENANT_DB_CHARSET || process.env.DB_CHARSET,
    migrations_dir: path.join(process.env.APP_ROOT_DIR, './src/database/migrations'),
    seeds_dir: path.join(process.env.APP_ROOT_DIR, './src/database/seeds/core'),
  },

  /**
   * Databases manager config.
   */
  manager: {
    superUser: process.env.SYSTEM_DB_USER || process.env.DB_USER,
    superPassword: process.env.SYSTEM_DB_PASSWORD || process.env.DB_PASSWORD,
  },

  /**
   * Mail.
   */
  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: !!Number.parseInt(process.env.MAIL_SECURE, 10),
    username: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD,
    from: process.env.MAIL_FROM_ADDRESS,
  },

  /**
   * Mongo DB.
   */
  mongoDb: {
    /**
     * That long string from mlab
     */
    databaseURL: process.env.MONGODB_DATABASE_URL,
  },

  /**
   * Agenda
   */
  agenda: {
    dbCollection: process.env.AGENDA_DB_COLLECTION,
    pooltime: process.env.AGENDA_POOL_TIME,
    concurrency: Number.parseInt(process.env.AGENDA_CONCURRENCY, 10),
  },

  /**
   * Agendash.
   */
  agendash: {
    user: process.env.AGENDASH_AUTH_USER,
    password: process.env.AGENDASH_AUTH_PASSWORD,
  },

  /**
   * Easy SMS gateway.
   */
  easySMSGateway: {
    api_key: process.env.EASY_SMS_TOKEN,
  },

  /**
   * JWT secret.
   */
  jwtSecret: process.env.JWT_SECRET,

  /**
   *
   */
  resetPasswordSeconds: 600,

  /**
   * Application base URL.
   */
  baseURL: process.env.BASE_URL,

  /**
   * General API prefix.
   */
  api: {
    prefix: '/api',
  },

  /**
   * Redis storage configuration.
   */
  redis: {
    port: 6379,
  },

  /**
   * Throttler configuration.
   */
  throttler: {
    login: {
      points: 5,
      duration: 60 * 60 * 24 * 1, // Store number for 90 days since first fail
      blockDuration: 60 * 15,
    },
    requests: {
      points: API_RATE_LIMIT[0] ? toInteger(API_RATE_LIMIT[0]) : 120,
      duration: API_RATE_LIMIT[1] ? toInteger(API_RATE_LIMIT[1]) : 60,
      blockDuration: API_RATE_LIMIT[2] ? toInteger(API_RATE_LIMIT[2]) : 60 * 10,
    },
  },

  /**
   * Sign-up restrictions
   */
  signupRestrictions: {
    disabled: parseBoolean<boolean>(process.env.SIGNUP_DISABLED, false),
    allowedDomains: castCommaListEnvVarToArray(process.env.SIGNUP_ALLOWED_DOMAINS),
    allowedEmails: castCommaListEnvVarToArray(process.env.SIGNUP_ALLOWED_EMAILS),
  },

  /**
   * Puppeteer remote browserless connection.
   */
  puppeteer: {
    browserWSEndpoint: process.env.BROWSER_WS_ENDPOINT,
  },

  scheduleComputeItemCost: 'in 5 seconds',

  /**
   * Latest tenant database batch number.
   *
   * Should increment the batch number once you create a new migrations or seeds
   * to application detarmines to upgrade.
   */
  databaseBatch: 4,

  /**
   * Exchange rate.
   */
  exchangeRate: {
    service: 'open-exchange-rate',
    openExchangeRate: {
      appId: process.env.OPEN_EXCHANGE_RATE_APP_ID,
    },
  },

  /**
   * Plaid.
   */
  plaid: {
    env: process.env.PLAID_ENV || 'sandbox',
    clientId: process.env.PLAID_CLIENT_ID,
    secretDevelopment: process.env.PLAID_SECRET_DEVELOPMENT,
    secretSandbox: process.env.PLAID_SECRET_SANDBOX,
    redirectSandBox: process.env.PLAID_SANDBOX_REDIRECT_URI,
    redirectDevelopment: process.env.PLAID_DEVELOPMENT_REDIRECT_URI,
    linkWebhook: process.env.PLAID_LINK_WEBHOOK,
  },
};
