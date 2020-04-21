const config = require('./config');

const configEnv = {
  client: config.system.db_client,
  connection: {
    host: config.system.db_host,
    user: config.system.db_user,
    password: config.system.db_password,
    database: config.system.db_name,
    charset: 'utf8',
  },
  migrations: {
    directory: config.system.migrations_dir,
  },
};

module.exports = {
  development: configEnv,
  production: configEnv,
};
