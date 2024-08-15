import dotenv from 'dotenv';
import path from 'path';
import { defaultTo, toInteger } from 'lodash';
import { castCommaListEnvVarToArray, parseBoolean } from '@/utils';

dotenv.config();

const API_RATE_LIMIT = process.env.API_RATE_LIMIT?.split(',') || [];

module.exports = {
  /**
   * Your favorite port
   */
  port: parseInt(process.env.PORT, 10),

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
    migrations_dir: path.join(global.__root_dir, './src/system/migrations'),
    seeds_dir: path.join(global.__root_dir, './src/system/seeds'),
  },

  /**
   * Tenant database configuration.
   */
  tenant: {
    db_client: process.env.TENANT_DB_CLIENT || process.env.DB_CLIENT || 'mysql',
    db_name_prefix: process.env.TENANT_DB_NAME_PERFIX || 'bigcapital_tenant_',
    db_host: process.env.TENANT_DB_HOST || process.env.DB_HOST,
    db_user: process.env.TENANT_DB_USER || process.env.DB_USER,
    db_password: process.env.TENANT_DB_PASSWORD || process.env.DB_PASSWORD,
    charset: process.env.TENANT_DB_CHARSET || process.env.DB_CHARSET,
    migrations_dir: path.join(global.__root_dir, './src/database/migrations'),
    seeds_dir: path.join(global.__root_dir, './src/database/seeds/core'),
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
    secure: parseBoolean(defaultTo(process.env.MAIL_SECURE, false), false),
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
    concurrency: parseInt(process.env.AGENDA_CONCURRENCY, 10),
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
    allowedDomains: castCommaListEnvVarToArray(
      process.env.SIGNUP_ALLOWED_DOMAINS
    ),
    allowedEmails: castCommaListEnvVarToArray(
      process.env.SIGNUP_ALLOWED_EMAILS
    ),
  },

  /**
   * Sign-up email confirmation
   */
  signupConfirmation: {
    enabled: parseBoolean<boolean>(
      process.env.SIGNUP_EMAIL_CONFIRMATION,
      false
    ),
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
   * Bank Synchronization.
   */
  bankSync: {
    enabled: parseBoolean(defaultTo(process.env.BANKING_CONNECT, false), false),
    provider: 'plaid',
  },

  /**
   * Plaid.
   */
  plaid: {
    env: process.env.PLAID_ENV || 'sandbox',
    clientId: process.env.PLAID_CLIENT_ID,
    secret: process.env.PLAID_SECRET,
    linkWebhook: process.env.PLAID_LINK_WEBHOOK,
  },

  /**
   * Lemon Squeezy.
   */
  lemonSqueezy: {
    key: process.env.LEMONSQUEEZY_API_KEY,
    storeId: process.env.LEMONSQUEEZY_STORE_ID,
    webhookSecret: process.env.LEMONSQUEEZY_WEBHOOK_SECRET,
    redirectTo: `${process.env.BASE_URL}/setup`,
  },

  /**
   * Bigcapital (Cloud).
   * NOTE: DO NOT CHANGE THIS OPTION OR ADD THIS ENV VAR.
   */
  hostedOnBigcapitalCloud: parseBoolean(
    defaultTo(process.env.HOSTED_ON_BIGCAPITAL_CLOUD, false),
    false
  ),

  /**
   * S3 for documents.
   */
  s3: {
    region: process.env.S3_REGION,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    endpoint: process.env.S3_ENDPOINT,
    bucket: process.env.S3_BUCKET || 'bigcapital-documents',
    forcePathStyle: parseBoolean(
      defaultTo(process.env.S3_FORCE_PATH_STYLE, false),
      false
    ),
  },

  loops: {
    apiKey: process.env.LOOPS_API_KEY,
  },
};
