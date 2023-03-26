import { differenceWith } from 'lodash';
import path from 'path';
import { FsMigrations } from './FsMigrations';
import {
  getTable,
  getTableName,
  getLockTableName,
  getLockTableNameWithSchema,
} from './TableUtils';
import { ISeederConfig, MigrateItem } from './interfaces';

/**
 * Get schema-aware schema builder for a given schema nam
 * @param trxOrKnex
 * @param {string} schemaName
 * @returns
 */
function getSchemaBuilder(trxOrKnex, schemaName: string | null = null) {
  return schemaName
    ? trxOrKnex.schema.withSchema(schemaName)
    : trxOrKnex.schema;
}

/**
 * Creates migration table of the given table name.
 * @param {string} tableName
 * @param {string} schemaName
 * @param trxOrKnex
 * @returns
 */
function createMigrationTable(
  tableName: string,
  schemaName: string,
  trxOrKnex
) {
  return getSchemaBuilder(trxOrKnex, schemaName).createTable(
    getTableName(tableName),
    (t) => {
      t.increments();
      t.string('name');
      t.integer('batch');
      t.timestamp('migration_time');
    }
  );
}

/**
 * Creates a migration lock table of the given table name.
 * @param {string} tableName
 * @param {string} schemaName
 * @param trxOrKnex
 * @returns
 */
function createMigrationLockTable(
  tableName: string,
  schemaName: string,
  trxOrKnex
) {
  return getSchemaBuilder(trxOrKnex, schemaName).createTable(tableName, (t) => {
    t.increments('index').primary();
    t.integer('is_locked');
  });
}

/**
 *
 * @param tableName
 * @param schemaName
 * @param trxOrKnex
 * @returns
 */
export function ensureMigrationTables(
  tableName: string,
  schemaName: string,
  trxOrKnex
) {
  const lockTable = getLockTableName(tableName);
  const lockTableWithSchema = getLockTableNameWithSchema(tableName, schemaName);

  return getSchemaBuilder(trxOrKnex, schemaName)
    .hasTable(tableName)
    .then((exists) => {
      return !exists && createMigrationTable(tableName, schemaName, trxOrKnex);
    })
    .then(() => {
      return getSchemaBuilder(trxOrKnex, schemaName).hasTable(lockTable);
    })
    .then((exists) => {
      return (
        !exists && createMigrationLockTable(lockTable, schemaName, trxOrKnex)
      );
    })
    .then(() => {
      return getTable(trxOrKnex, lockTable, schemaName).select('*');
    })
    .then((data) => {
      return (
        !data.length &&
        trxOrKnex.into(lockTableWithSchema).insert({ is_locked: 0 })
      );
    });
}

/**
 * Lists all available migration versions, as a sorted array.
 * @param migrationSource
 * @param loadExtensions
 * @returns
 */
function listAll(
  migrationSource: FsMigrations,
  loadExtensions
): Promise<MigrateItem[]> {
  return migrationSource.getMigrations(loadExtensions);
}

/**
 * Lists all migrations that have been completed for the current db, as an array.
 * @param {string} tableName
 * @param {string} schemaName
 * @param {} trxOrKnex
 * @returns Promise<string[]>
 */
export async function listCompleted(
  tableName: string,
  schemaName: string,
  trxOrKnex
): Promise<string[]> {
  const completedMigrations = await trxOrKnex
    .from(getTableName(tableName, schemaName))
    .orderBy('id')
    .select('name');

  return completedMigrations.map((migration) => {
    return migration.name;
  });
}

/**
 * Gets the migration list from the migration directory specified in config, as well as
 * the list of completed migrations to check what should be run.
 */
export function listAllAndCompleted(config: ISeederConfig, trxOrKnex) {
  return Promise.all([
    listAll(config.migrationSource, config.loadExtensions),
    listCompleted(config.tableName, config.schemaName, trxOrKnex),
  ]);
}

/**
 *
 * @param migrationSource
 * @param all
 * @param completed
 * @returns
 */
export function getNewMigrations(
  migrationSource: FsMigrations,
  all: MigrateItem[],
  completed: string[]
): MigrateItem[] {
  return differenceWith(all, completed, (allMigration, completedMigration) => {
    return (
      completedMigration === migrationSource.getMigrationName(allMigration)
    );
  });
}

function startsWithNumber(str) {
  return /^\d/.test(str);
}
/**
 *
 * @param {FsMigrations} migrationSource -
 * @param {MigrateItem[]} migrations -
 * @param {string[]} loadExtensions -
 * @returns
 */
export function filterMigrations(
  migrationSource: FsMigrations,
  migrations: MigrateItem[],
  loadExtensions: string[]
) {
  return migrations.filter((migration) => {
    const migrationName = migrationSource.getMigrationName(migration);
    const extension = path.extname(migrationName);

    return (
      loadExtensions.includes(extension) && startsWithNumber(migrationName)
    );
  });
}
