import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Your favorite port
   */
  port: parseInt(process.env.PORT, 10),

  system: {
    db_client: 'mysql',
    db_host: '127.0.0.1',
    db_user: 'root',
    db_password: 'root',
    db_name: 'bigcapital_system',
    migrations_dir: './src/system/migrations',
    seeds_dir: './src/system/seeds',
  },
  tenant: {
    db_client: 'mysql',
    db_name_prefix: 'bigcapital_tenant_',
    db_host: '127.0.0.1',
    db_user: 'root',
    db_password: 'root',
    charset: 'utf8',
    migrations_dir: 'src/database/migrations',
    seeds_dir: 'src/database/seeds/core',
    seeds_table_name: 'seeds_versioning',
  },
  manager: {
    superUser: 'root',
    superPassword: 'root',
  },
  mail: {
    host: 'smtp.mailtrap.io',
    port: 587,
    secure: false,
    username: '842f331d3dc005',
    password: '172f97b34f1a17',
  },
  mongoDb: {
    /**
     * That long string from mlab
     */
    databaseURL: 'mongodb://localhost/bigcapital',
  },
  /**
   * Agenda.js stuff
   */
  agenda: {
    dbCollection: process.env.AGENDA_DB_COLLECTION,
    pooltime: process.env.AGENDA_POOL_TIME,
    concurrency: parseInt(process.env.AGENDA_CONCURRENCY, 10),
  },

  /**
   * Agendash config
   */
  agendash: {
    user: 'agendash',
    password: '123456'
  },

  /**
   * Subscription config.
   */
  subscription: {
    user: 'root',
    password: 'root',
  },

  SMSGateway: {
    type: '',
    endpoint: '',
  },
  easySMSGateway: {
    api_key: 'b0JDZW56RnV6aEthb0RGPXVEcUI'
  },
  jwtSecret: 'b0JDZW56RnV6aEthb0RGPXVEcUI',
  contactUsMail: 'support@bigcapital.ly',
  baseURL: 'https://bigcapital.ly',

  api: {
    prefix: '/api'
  },
  resetPasswordSeconds: 600,

  licensesAuth: {
    user: 'admin',
    password: 'admin',
  },
};
