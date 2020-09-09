import TenantRepository from '@/repositories/TenantRepository';

export default class AccountTypeRepository extends TenantRepository {
  cache: any;
  models: any;

  /**
   * Constructor method.
   * @param {number} tenantId - The given tenant id.
   */
  constructor(
    tenantId: number,
  ) {
    super(tenantId);

    this.models = this.tenancy.models(tenantId);
    this.cache = this.tenancy.cache(tenantId);
  }

  /**
   * Retrieve account type meta.
   * @param {number} accountTypeId 
   */
  getTypeMeta(accountTypeId: number) {
    const { AccountType } = this.models;
    return this.cache.get(`accountType.${accountTypeId}`, () => {
      return AccountType.query().findById(accountTypeId);
    });
  }
}