import TenantRepository from 'repositories/TenantRepository';
import { IAccount } from 'interfaces';
import { Account } from 'models';

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
   * @return {IAccount[]}
   */
  allAccounts(): IAccount[] {
    const { Account } = this.models;
    return this.cache.get('accounts', async () => {
      return Account.query();
    });
  }

  /**
   * Retrieve account of the given account slug.
   * @param {string} slug 
   * @return {IAccount}
   */
  getBySlug(slug: string): IAccount {
    const { Account } = this.models;
    return this.cache.get(`accounts.slug.${slug}`, () => {
      return Account.query().findOne('slug', slug);
    });
  }

  /**
   * Retrieve the account by the given id.
   * @param  {number} id - Account id.
   * @return {IAccount}
   */
  getById(id: number): IAccount {
    const { Account } = this.models;
    return this.cache.get(`accounts.id.${id}`, () => {
      return Account.query().findById(id);
    });
  }

  /**
   * Retrieve accounts by the given ids.
   * @param {number[]} ids -
   * @return {IAccount[]}
   */
  findByIds(accountsIds: number[]) {
    const { Account } = this.models;
    return Account.query().whereIn('id', accountsIds);
  }

  /**
   * Activate the given account.
   * @param  {number} accountId - 
   * @return {void}
   */
  async activate(accountId: number): Promise<void> {
    const { Account } = this.models;
    await Account.query().findById(accountId).patch({ active: 1 })
    this.flushCache();
  }

  /**
   * Inserts a new accounts to the storage.
   * @param {IAccount} account 
   */
  async insert(account: IAccount): Promise<void> {
    const { Account } = this.models;
    await Account.query().insertAndFetch({ ...account });
    this.flushCache();
  }

  /**
   * Updates account of the given account.
   * @param  {number} accountId - Account id.
   * @param  {IAccount} account
   * @return {void}
   */
  async edit(accountId: number, account: IAccount): Promise<void> {
    const { Account } = this.models;
    await Account.query().findById(accountId).patch({ ...account });
    this.flushCache();
  }

  /**
   * Deletes the given account by id.
   * @param {number} accountId - Account id.
   */
  async deleteById(accountId: number): Promise<void> {
    const { Account } = this.models;
    await Account.query().deleteById(accountId);
    this.flushCache();
  }

  /**
   * Flush repository cache.
   */
  flushCache(): void {
    this.cache.delStartWith('accounts');
  }
}