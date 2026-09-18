import { readdir } from 'fs/promises';
import { basename, extname, join, resolve } from 'path';
import { Knex } from 'knex';

/**
 * Loads the tenant migrations whether the server runs compiled or from source.
 *
 * The migrations are .ts files under src and compile to .js in dist, next to
 * this file, so the ones to load share this file's extension. Loading only
 * '.js', as before, found nothing from source (ts-node, jest) and left a new
 * tenant without a schema.
 *
 * knex records each migration it runs by name, and checks every recorded name
 * is still on disk. So each is named after its compiled file, `<name>.js`,
 * however it was loaded: a tenant migrated by the compiled server and one
 * migrated from source keep the same history, and either can migrate the other.
 */
export class TenantMigrationSource implements Knex.MigrationSource<string> {
  private readonly directory: string;

  constructor(
    directory: string,
    private readonly extension: string = extname(__filename),
  ) {
    this.directory = resolve(directory);
  }

  public async getMigrations(): Promise<string[]> {
    const files = await readdir(this.directory);

    return files
      .filter((file) => extname(file) === this.extension)
      .filter((file) => !file.endsWith('.d.ts'))
      .sort();
  }

  public getMigrationName(file: string): string {
    return `${basename(file, this.extension)}.js`;
  }

  public async getMigration(file: string): Promise<Knex.Migration> {
    return require(join(this.directory, file));
  }
}
