export class TenantDBAlreadyExists extends Error {
  constructor(description: string = 'Tenant DB is already exists.') {
    super(description);
    this.name = 'TenantDBAlreadyExists';
  }
}
