export class TenantDatabaseNotBuilt extends Error {
  constructor(description: string = 'Tenant database is not built yet.') {
    super(description);
    this.name = 'TenantDatabaseNotBuilt';
  }
}
