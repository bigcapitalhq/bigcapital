import { Account } from 'models';
import TenantRepository from 'repositories/TenantRepository';

export default class AccountRepository extends TenantRepository {
  /**
   * Constructor method.
   */
  constructor(knex, cache) {
    super(knex, cache);
    this.model = Account;
  }

  /**
   * Retrieve accounts dependency graph.
   * @returns {}
   */
  async getDependencyGraph(withRelation) {
    const accounts = await this.all(withRelation);
    const cacheKey = this.getCacheKey('accounts.depGraph', withRelation);

    return this.cache.get(cacheKey, async () => {
      return this.model.toDependencyGraph(accounts);
    });
  }

  /**
   * Changes account balance.
   * @param {number} accountId 
   * @param {number} amount 
   * @return {Promise<void>}
   */
  async balanceChange(accountId: number, amount: number): Promise<void> {
    const method: string = (amount < 0) ? 'decrement' : 'increment';

    await this.model.query().where('id', accountId)[method]('amount', amount);
    this.flushCache();
  }
}