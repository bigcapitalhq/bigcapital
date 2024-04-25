const { knexSnakeCaseMappers } = require('objection');

module.exports = {
  tenant: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: 'root',
      password: 'root',
      database: 'bigcapital_tenant_hqde5zqkylsho06',
      charset: 'utf8',
    },
    migrations: {
      directory: './src/database/migrations',
    },
    pool: { min: 0, max: 7 },
    ...knexSnakeCaseMappers({ upperCase: true }),
  },
  system: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: 'root',
      password: 'root',
      database: 'bigcapital_system',
      charset: 'utf8',
    },
    migrations: {
      directory: './src/system/migrations',
    },
    pool: { min: 0, max: 7 },
    ...knexSnakeCaseMappers({ upperCase: true }),
  }
};
