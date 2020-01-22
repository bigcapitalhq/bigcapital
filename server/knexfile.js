require('dotenv').config();

const MIGRATIONS_DIR = './src/database/migrations';
const SEEDS_DIR = './src/database/seeds';

module.exports = {
  test: {
    client: process.env.DB_CLIENT,
    migrations: {
      directory: MIGRATIONS_DIR,
    },
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      charset: 'utf8',
    },
  },
  development: {
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      charset: 'utf8',
    },
    migrations: {
      directory: MIGRATIONS_DIR,
    },
    seeds: {
      directory: SEEDS_DIR,
    },
  },
  production: {
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      charset: 'utf8',
    },
    migrations: {
      directory: MIGRATIONS_DIR,
    },
    seeds: {
      directory: SEEDS_DIR,
    },
  },
};
