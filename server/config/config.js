
module.exports = {
  system: {
    db_client: 'mysql',
    db_host: '127.0.0.1',
    db_user: 'root',
    db_password: 'root',
    db_name: 'bigcapital_system',
    migrations_dir: './src/system/migrations',
  },
  tenant: {
    db_client: 'mysql',
    db_name_prefix: 'bigcapital_tenant_',
    db_host: '127.0.0.1',
    db_user: 'root',
    db_password: 'root',
    charset: 'utf8',
    migrations_dir: 'src/database/migrations',
    seeds_dir: 'src/database/seeds',
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
  }
};
