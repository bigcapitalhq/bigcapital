export class TenantAlreadySeeded extends Error {
  constructor(description: string = 'Tenant is already seeded') {
    super(description);
    this.name = 'TenantAlreadySeeded';
  }
}
