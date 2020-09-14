import TenantRepository from 'repositories/TenantRepository';

export default class AccountRepository extends TenantRepository {
  models: any;
  repositories: any;
  cache: any;

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
   * Retrieve accounts dependency graph.
   * @returns {}
   */
  async getDependencyGraph() {
    const { Account } = this.models;
    const accounts = await this.allAccounts();

    return this.cache.get('accounts.depGraph', async () => {
      return Account.toDependencyGraph(accounts);
    });
  }

  /**
   * Retrieve all accounts on the storage.
   * @return {}
   */
  allAccounts() {
    const { Account } = this.models;
    return this.cache.get('accounts', async () => {
      return Account.query();
    });
  }

  /**
   * Retrieve account of the given account slug.
   * @param {string} slug 
   */
  getBySlug(slug: string) {
    const { Account } = this.models;
    return this.cache.get(`accounts.slug.${slug}`, () => {
      return Account.query().findOne('slug', slug);
    });
  }

  /**
   * Retrieve the account by the given id.
   * @param {number} id - Account id.
   */
  getById(id: number) {
    const { Account } = this.models;
    return this.cache.get(`accounts.id.${id}`, () => {
      return Account.query().findById(id);
    });
  }

}