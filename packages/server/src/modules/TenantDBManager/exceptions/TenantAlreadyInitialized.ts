export class TenantAlreadyInitialized extends Error {
  constructor(description: string = 'Tenant is already initialized') {
    super(description);
    this.name = 'TenantAlreadyInitialized';
  }
}
