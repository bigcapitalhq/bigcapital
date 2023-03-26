import { Knex } from 'knex';
import Bluebird from 'bluebird';
import { getTable, getTableName, getLockTableName } from './TableUtils';
import getMergedConfig from './SeederConfig';
import {
  listAllAndCompleted,
  getNewMigrations,
  listCompleted,
  ensureMigrationTables,
} from './MigrateUtils';
import { MigrateItem, SeedMigrationContext, ISeederConfig } from './interfaces';
import { FsMigrations } from './FsMigrations';

export class SeedMigration {
  knex: Knex;
  config: ISeederConfig;
  migrationSource: FsMigrations;
  context: SeedMigrationContext;

  /**
   * Constructor method.
   * @param {Knex} knex - Knex instance.
   * @param {SeedMigrationContext} context -
   */
  constructor(knex: Knex, context: SeedMigrationContext) {
    this.knex = knex;
    this.config = getMergedConfig(this.knex.client.config.seeds, undefined);
    this.migrationSource = this.config.migrationSource;
    this.context = context;
  }

  /**
   * Latest migration.
   * @returns {Promise<void>}
   */
  async latest(config = null): Promise<void> {
    // Merges the configuration.
    this.config = getMergedConfig(config, this.config);

    // Ensure migration tables.
    await ensureMigrationTables(this.config.tableName, null, this.knex);

    // Retrieve all and completed migrations.
    const [all, completed] = await listAllAndCompleted(this.config, this.knex);

    // Retrieve the new migrations.
    const migrations = getNewMigrations(this.migrationSource, all, completed);

    // Run the latest migration on one batch.
    return this.knex.transaction((trx: Knex.Transaction) => {
      return this.runBatch(migrations, 'up', trx);
    });
  }

  /**
   * Add migration lock flag.
   * @param {Knex.Transaction} trx
   * @returns
   */
  private migrateLockTable(trx: Knex.Transaction) {
    const tableName = getLockTableName(this.config.tableName);
    return getTable(this.knex, tableName, this.config.schemaName)
      .transacting(trx)
      .where('is_locked', '=', 0)
      .update({ is_locked: 1 })
      .then((rowCount) => {
        if (rowCount != 1) {
          throw new Error('Migration table is already locked');
        }
      });
  }

  /**
   * Add migration lock flag.
   * @param {Knex.Transaction} trx
   * @returns
   */
  private migrationLock(trx: Knex.Transaction) {
    return this.migrateLockTable(trx);
  }

  /**
   * Free the migration lock flag.
   * @param {Knex.Transaction} trx
   * @returns
   */
  private freeLock(trx = this.knex): Promise<void> {
    const tableName = getLockTableName(this.config.tableName);

    return getTable(trx, tableName, this.config.schemaName).update({
      is_locked: 0,
    });
  }

  /**
   * Returns the latest batch number.
   * @param trx
   * @returns
   */
  private latestBatchNumber(trx = this.knex): number {
    return trx
      .from(getTableName(this.config.tableName, this.config.schemaName))
      .max('batch as max_batch')
      .then((obj) => obj[0].max_batch || 0);
  }

  /**
   * Runs a batch of `migrations` in a specified `direction`, saving the
   * appropriate database information as the migrations are run.
   * @param   {number} batchNo
   * @param   {MigrateItem[]} migrations
   * @param   {string} direction
   * @param   {Knex.Transaction} trx
   * @returns {Promise<void>}
   */
  private waterfallBatch(
    batchNo: number,
    migrations: MigrateItem[],
    direction: string,
    trx: Knex.Transaction
  ): Promise<void> {
    const { tableName } = this.config;

    return Bluebird.each(migrations, (migration) => {
      const name = this.migrationSource.getMigrationName(migration);

      return this.migrationSource
        .getMigration(migration)
        .then((migrationContent) =>
          this.runMigrationContent(migrationContent.default, direction, trx)
        )
        .then(() => {
          if (direction === 'up') {
            return trx.into(getTableName(tableName)).insert({
              name,
              batch: batchNo,
              migration_time: new Date(),
            });
          }
          if (direction === 'down') {
            return trx.from(getTableName(tableName)).where({ name }).del();
          }
        });
    });
  }

  /**
   * Runs and builds the given migration class.
   */
  private runMigrationContent(Migration, direction, trx) {
    const instance = new Migration(trx);

    if (this.context.i18n) {
      instance.setI18n(this.context.i18n);
    }
    instance.setTenant(this.context.tenant);

    return instance[direction](trx);
  }

  /**
   * Validates some migrations by requiring and checking for an `up` and `down`function.
   * @param {MigrateItem} migration
   * @returns {MigrateItem}
   */
  async validateMigrationStructure(migration: MigrateItem): MigrateItem {
    const migrationName = this.migrationSource.getMigrationName(migration);

    // maybe promise
    const migrationContent = await this.migrationSource.getMigration(migration);
    if (
      typeof migrationContent.up !== 'function' ||
      typeof migrationContent.down !== 'function'
    ) {
      throw new Error(
        `Invalid migration: ${migrationName} must have both an up and down function`
      );
    }
    return migration;
  }

  /**
   * Run a batch of current migrations, in sequence.
   * @param   {MigrateItem[]} migrations
   * @param   {string} direction
   * @param   {Knex.Transaction} trx
   * @returns {Promise<void>}
   */
  private async runBatch(
    migrations: MigrateItem[],
    direction: string,
    trx: Knex.Transaction
  ): Promise<void> {
    // Adds flag to migration lock.
    await this.migrationLock(trx);

    // When there is a wrapping transaction, some migrations
    // could have been done while waiting for the lock:
    const completed = await listCompleted(
      this.config.tableName,
      this.config.schemaName,
      trx
    );
    // Differentiate between all and completed to get new migrations.
    const newMigrations = getNewMigrations(
      this.config.migrationSource,
      migrations,
      completed
    );
    // Retrieve the latest batch number.
    const batchNo = await this.latestBatchNumber(trx);

    // Increment the next batch number.
    const newBatchNo = direction === 'up' ? batchNo + 1 : batchNo;

    // Run all migration files in waterfall.
    await this.waterfallBatch(newBatchNo, newMigrations, direction, trx);

    // Free the migration lock flag.
    await this.freeLock(trx);
  }
}
