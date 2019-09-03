
const MIGRATIONS_DIR = `./${__dirname}/src/database/migrations`;
const SEEDS_DIR = `./${__dirname}/src/database/seeds`;

module.exports = {
  test: {
    client: process.env.DB_CLIENT,
    migrations: {
      directory: MIGRATIONS_DIR,
    },
    connection: {
      host: '172.17.0.2',
      user: 'root',
      password: 'root',
      database: 'moosher',
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
