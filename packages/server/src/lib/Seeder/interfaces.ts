import { ITenant } from "interfaces";

export interface FsMigrations {}

export interface ISeederConfig {
  tableName: string;
  migrationSource: FsMigrations;
  schemaName?: string;
  loadExtensions: string[];
}

export interface MigrateItem {
  file: string;
  directory: string;
}

export interface SeedMigrationContext {
  i18n: i18nAPI;
  tenant: ITenant;
}