import { Knex } from 'knex';

export interface ITenantMetadata {
  currencyCode: string;
}
export interface ITenant {
  id: number,
  organizationId: string,

  initializedAt: Date|null,
  seededAt: Date|null,
  builtAt: Date|null,
  createdAt: Date|null,

  metadata?: ITenantMetadata
}

export interface ITenantDBManager {
  constructor();

  databaseExists(tenant: ITenant): Promise<boolean>;
  createDatabase(tenant: ITenant): Promise<void>;

  migrate(tenant: ITenant): Promise<void>;
  seed(tenant: ITenant): Promise<void>;

  setupKnexInstance(tenant: ITenant): Knex;
  getKnexInstance(tenantId: number): Knex;
}

export interface ITenantManager {
  tenantDBManager: ITenantDBManager;
  tenant: ITenant;

  constructor(): void;

  createTenant(): Promise<ITenant>;
  createDatabase(tenant: ITenant): Promise<void>;
  hasDatabase(tenant: ITenant): Promise<boolean>;

  dropTenant(tenant: ITenant): Promise<void>;

  migrateTenant(tenant: ITenant): Promise<void>;
  seedTenant(tenant: ITenant): Promise<void>;

  setupKnexInstance(tenant: ITenant): Knex;
  getKnexInstance(tenantId: number): Knex;
}

export interface ISystemService {
  cache();
  repositories();
  knex();
}