import type { FsMigrations } from './FsMigrations';

import { TenantModel } from '@/modules/System/models/TenantModel';

export type { FsMigrations };

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
  i18n: any;
  tenant: TenantModel;
}
