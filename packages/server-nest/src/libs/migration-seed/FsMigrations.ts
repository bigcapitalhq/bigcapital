import path from 'path';
import { sortBy } from 'lodash';
import fs from 'fs';
import { promisify } from 'util';
import { MigrateItem } from './interfaces';
import { importWebpackSeedModule } from './Utils';
import { DEFAULT_LOAD_EXTENSIONS } from './constants';
import { filterMigrations } from './MigrateUtils';

const readdir = promisify(fs.readdir);

class FsMigrations {
  private sortDirsSeparately: boolean;
  private migrationsPaths: string[];
  private loadExtensions: string[];

  /**
   * Constructor method.
   * @param migrationDirectories
   * @param sortDirsSeparately
   * @param loadExtensions
   */
  constructor(
    migrationDirectories: string[],
    sortDirsSeparately: boolean,
    loadExtensions: string[]
  ) {
    this.sortDirsSeparately = sortDirsSeparately;

    if (!Array.isArray(migrationDirectories)) {
      migrationDirectories = [migrationDirectories];
    }
    this.migrationsPaths = migrationDirectories;
    this.loadExtensions = loadExtensions || DEFAULT_LOAD_EXTENSIONS;
  }

  /**
   * Gets the migration names
   * @returns Promise<MigrateItem[]>
   */
  public getMigrations(loadExtensions = null): Promise<MigrateItem[]> {
    // Get a list of files in all specified migration directories
    const readMigrationsPromises = this.migrationsPaths.map((configDir) => {
      const absoluteDir = path.resolve(process.cwd(), configDir);
      return readdir(absoluteDir).then((files) => ({
        files,
        configDir,
        absoluteDir,
      }));
    });

    return Promise.all(readMigrationsPromises).then((allMigrations) => {
      const migrations = allMigrations.reduce((acc, migrationDirectory) => {
        // When true, files inside the folder should be sorted
        if (this.sortDirsSeparately) {
          migrationDirectory.files = migrationDirectory.files.sort();
        }
        migrationDirectory.files.forEach((file) =>
          acc.push({ file, directory: migrationDirectory.configDir })
        );
        return acc;
      }, []);

      // If true we have already sorted the migrations inside the folders
      // return the migrations fully qualified
      if (this.sortDirsSeparately) {
        return filterMigrations(
          this,
          migrations,
          loadExtensions || this.loadExtensions
        );
      }
      return filterMigrations(
        this,
        sortBy(migrations, 'file'),
        loadExtensions || this.loadExtensions
      );
    });
  }

  /**
   * Retrieve the file name from given migrate item.
   * @param {MigrateItem} migration
   * @returns {string}
   */
  public getMigrationName(migration: MigrateItem): string {
    return migration.file;
  }

  /**
   * Retrieve the migrate file content from given migrate item.
   * @param {MigrateItem} migration
   * @returns {string}
   */
  public getMigration(migration: MigrateItem): string {
    return importWebpackSeedModule(migration.file);
  }
}

export { DEFAULT_LOAD_EXTENSIONS, FsMigrations };
