import { registerAs } from '@nestjs/config';

export default registerAs('systemDatabase', () => ({
  client: 'mysql',
  host: process.env.SYSTEM_DB_HOST || process.env.DB_HOST,
  port: process.env.SYSTEM_DB_PORT || process.env.DB_PORT || 5432,
  user: process.env.SYSTEM_DB_USER || process.env.DB_USER,
  password: process.env.SYSTEM_DB_PASSWORD || process.env.DB_PASSWORD,
  databaseName: process.env.SYSTEM_DB_NAME || process.env.DB_NAME,
  migrationDir: process.env.SYSTEM_DB_MIGRATION_DIR || './src/database/system/migrations',
  seedsDir: process.env.SYSTEM_DB_SEEDS_DIR || './src/database/system/seeds',
}));
