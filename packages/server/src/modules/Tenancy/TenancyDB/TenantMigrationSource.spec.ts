import { mkdtempSync, readdirSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { TenantMigrationSource } from './TenantMigrationSource';

const MIGRATIONS_DIR = join(__dirname, '../../../database/tenant/migrations');

/**
 * A directory laid out like dist: compiled migrations and their source maps.
 */
const compiledDir = () => {
  const dir = mkdtempSync(join(tmpdir(), 'tenant-migrations-'));

  readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith('.ts'))
    .forEach((file) => {
      const compiled = file.replace(/\.ts$/, '.js');
      writeFileSync(join(dir, compiled), 'exports.up = () => {};');
      writeFileSync(join(dir, `${compiled}.map`), '{}');
    });
  return dir;
};

const namesOf = async (source: TenantMigrationSource) =>
  (await source.getMigrations()).map((file) => source.getMigrationName(file));

describe('TenantMigrationSource', () => {
  it('finds the migrations when running from source', async () => {
    const source = new TenantMigrationSource(MIGRATIONS_DIR, '.ts');
    const migrations = await source.getMigrations();

    expect(migrations.length).toBeGreaterThan(0);
    expect(migrations.every((file) => file.endsWith('.ts'))).toBe(true);
  });

  it('skips source maps next to the compiled migrations', async () => {
    const source = new TenantMigrationSource(compiledDir(), '.js');
    const migrations = await source.getMigrations();

    expect(migrations.length).toBeGreaterThan(0);
    expect(migrations.every((file) => file.endsWith('.js'))).toBe(true);
  });

  // knex refuses to migrate a tenant whose recorded migrations it cannot
  // find by name, so both must name them alike.
  it('names the migrations alike from source and compiled', async () => {
    const fromSource = await namesOf(
      new TenantMigrationSource(MIGRATIONS_DIR, '.ts'),
    );
    const compiled = await namesOf(
      new TenantMigrationSource(compiledDir(), '.js'),
    );

    expect(fromSource).toEqual(compiled);
    expect(fromSource[0]).toMatch(/^\d+_.+\.js$/);
  });

  it('loads a migration', async () => {
    const source = new TenantMigrationSource(MIGRATIONS_DIR, '.ts');
    const [first] = await source.getMigrations();
    const migration = await source.getMigration(first);

    expect(typeof migration.up).toBe('function');
  });
});
