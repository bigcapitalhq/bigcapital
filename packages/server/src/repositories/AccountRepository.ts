import { Account } from 'models';
import TenantRepository from '@/repositories/TenantRepository';
import { IAccount } from '@/interfaces';
import { Knex } from 'knex';
import {
  DiscountExpenseAccount,
  OtherChargesAccount,
  OtherExpensesAccount,
  PrepardExpenses,
  PurchaseDiscountAccount,
  StripeClearingAccount,
  TaxPayableAccount,
  UnearnedRevenueAccount,
} from '@/database/seeds/data/accounts';
import { TenantMetadata } from '@/system/models';

export default class AccountRepository extends TenantRepository {
  /**
   * Gets the repository's model.
   */
  get model() {
    return Account.bindKnex(this.knex);
  }

  /**
   * Retrieve accounts dependency graph.
   * @returns {}
   */
  async getDependencyGraph(withRelation, trx) {
    const accounts = await this.all(withRelation, trx);

    return this.model.toDependencyGraph(accounts);
  }

  /**
   * Retrieve.
   * @param {string} slug
   * @return {Promise<IAccount>}
   */
  findBySlug(slug: string) {
    return this.findOne({ slug });
  }

  /**
   * Changes account balance.
   * @param {number} accountId
   * @param {number} amount
   * @return {Promise<void>}
   */
  async balanceChange(accountId: number, amount: number): Promise<void> {
    const method: string = amount < 0 ? 'decrement' : 'increment';

    await this.model.query().where('id', accountId)[method]('amount', amount);
    this.flushCache();
  }

  /**
   * Activate user by the given id.
   * @param  {number} userId - User id.
   * @return {Promise<void>}
   */
  activateById(userId: number): Promise<IAccount> {
    return super.update({ active: 1 }, { id: userId });
  }

  /**
   * Inactivate user by the given id.
   * @param  {number} userId - User id.
   * @return {Promise<void>}
   */
  inactivateById(userId: number): Promise<void> {
    return super.update({ active: 0 }, { id: userId });
  }

  /**
   * Activate user by the given id.
   * @param  {number} userId - User id.
   * @return {Promise<void>}
   */
  async activateByIds(userIds: number[], trx): Promise<IAccount> {
    const results = await this.model
      .query(trx)
      .whereIn('id', userIds)
      .patch({ active: true });

    this.flushCache();
    return results;
  }

  /**
   * Inactivate user by the given id.
   * @param  {number} userId - User id.
   * @return {Promise<void>}
   */
  async inactivateByIds(userIds: number[], trx): Promise<IAccount> {
    const results = await this.model
      .query(trx)
      .whereIn('id', userIds)
      .patch({ active: false });

    this.flushCache();
    return results;
  }

  /**
   *
   * @param {string} currencyCode
   * @param extraAttrs
   * @param trx
   * @returns
   */
  findOrCreateAccountReceivable = async (
    currencyCode: string = '',
    extraAttrs = {},
    trx?: Knex.Transaction
  ) => {
    let result = await this.model
      .query(trx)
      .onBuild((query) => {
        if (currencyCode) {
          query.where('currencyCode', currencyCode);
        }
        query.where('accountType', 'accounts-receivable');
      })
      .first();

    if (!result) {
      result = await this.model.query(trx).insertAndFetch({
        name: this.i18n.__('account.accounts_receivable.currency', {
          currency: currencyCode,
        }),
        accountType: 'accounts-receivable',
        currencyCode,
        active: 1,
        ...extraAttrs,
      });
    }
    return result;
  };

  /**
   * Find or create tax payable account.
   * @param {Record<string, string>}extraAttrs
   * @param {Knex.Transaction} trx
   * @returns
   */
  async findOrCreateTaxPayable(
    extraAttrs: Record<string, string> = {},
    trx?: Knex.Transaction
  ) {
    let result = await this.model
      .query(trx)
      .findOne({ slug: TaxPayableAccount.slug, ...extraAttrs });

    if (!result) {
      result = await this.model.query(trx).insertAndFetch({
        ...TaxPayableAccount,
        ...extraAttrs,
      });
    }
    return result;
  }

  findOrCreateAccountsPayable = async (
    currencyCode: string = '',
    extraAttrs = {},
    trx?: Knex.Transaction
  ) => {
    let result = await this.model
      .query(trx)
      .onBuild((query) => {
        if (currencyCode) {
          query.where('currencyCode', currencyCode);
        }
        query.where('accountType', 'accounts-payable');
      })
      .first();

    if (!result) {
      result = await this.model.query(trx).insertAndFetch({
        name: this.i18n.__('account.accounts_payable.currency', {
          currency: currencyCode,
        }),
        accountType: 'accounts-payable',
        currencyCode,
        active: 1,
        ...extraAttrs,
      });
    }
    return result;
  };

  /**
   * Finds or creates the unearned revenue.
   * @param {Record<string, string>} extraAttrs
   * @param {Knex.Transaction} trx
   * @returns
   */
  public async findOrCreateUnearnedRevenue(
    extraAttrs: Record<string, string> = {},
    trx?: Knex.Transaction
  ) {
    // Retrieves the given tenant metadata.
    const tenantMeta = await TenantMetadata.query().findOne({
      tenantId: this.tenantId,
    });
    const _extraAttrs = {
      currencyCode: tenantMeta.baseCurrency,
      ...extraAttrs,
    };
    let result = await this.model
      .query(trx)
      .findOne({ slug: UnearnedRevenueAccount.slug, ..._extraAttrs });

    if (!result) {
      result = await this.model.query(trx).insertAndFetch({
        ...UnearnedRevenueAccount,
        ..._extraAttrs,
      });
    }
    return result;
  }

  /**
   * Finds or creates the prepard expenses account.
   * @param {Record<string, string>} extraAttrs
   * @param {Knex.Transaction} trx
   * @returns
   */
  public async findOrCreatePrepardExpenses(
    extraAttrs: Record<string, string> = {},
    trx?: Knex.Transaction
  ) {
    // Retrieves the given tenant metadata.
    const tenantMeta = await TenantMetadata.query().findOne({
      tenantId: this.tenantId,
    });
    const _extraAttrs = {
      currencyCode: tenantMeta.baseCurrency,
      ...extraAttrs,
    };

    let result = await this.model
      .query(trx)
      .findOne({ slug: PrepardExpenses.slug, ..._extraAttrs });

    if (!result) {
      result = await this.model.query(trx).insertAndFetch({
        ...PrepardExpenses,
        ..._extraAttrs,
      });
    }
    return result;
  }

  /**
   * Finds or creates the stripe clearing account.
   * @param {Record<string, string>} extraAttrs
   * @param {Knex.Transaction} trx
   * @returns
   */
  public async findOrCreateStripeClearing(
    extraAttrs: Record<string, string> = {},
    trx?: Knex.Transaction
  ) {
    // Retrieves the given tenant metadata.
    const tenantMeta = await TenantMetadata.query().findOne({
      tenantId: this.tenantId,
    });
    const _extraAttrs = {
      currencyCode: tenantMeta.baseCurrency,
      ...extraAttrs,
    };

    let result = await this.model
      .query(trx)
      .findOne({ slug: StripeClearingAccount.slug, ..._extraAttrs });

    if (!result) {
      result = await this.model.query(trx).insertAndFetch({
        ...StripeClearingAccount,
        ..._extraAttrs,
      });
    }
    return result;
  }

  /**
   * Finds or creates the discount expense account.
   * @param {Record<string, string>} extraAttrs
   * @param {Knex.Transaction} trx
   * @returns
   */
  public async findOrCreateDiscountAccount(
    extraAttrs: Record<string, string> = {},
    trx?: Knex.Transaction
  ) {
    // Retrieves the given tenant metadata.
    const tenantMeta = await TenantMetadata.query().findOne({
      tenantId: this.tenantId,
    });
    const _extraAttrs = {
      currencyCode: tenantMeta.baseCurrency,
      ...extraAttrs,
    };

    let result = await this.model
      .query(trx)
      .findOne({ slug: DiscountExpenseAccount.slug, ..._extraAttrs });

    if (!result) {
      result = await this.model.query(trx).insertAndFetch({
        ...DiscountExpenseAccount,
        ..._extraAttrs,
      });
    }
    return result;
  }

  public async findOrCreatePurchaseDiscountAccount(
    extraAttrs: Record<string, string> = {},
    trx?: Knex.Transaction
  ) {
    // Retrieves the given tenant metadata.
    const tenantMeta = await TenantMetadata.query().findOne({
      tenantId: this.tenantId,
    });
    const _extraAttrs = {
      currencyCode: tenantMeta.baseCurrency,
      ...extraAttrs,
    };

    let result = await this.model
      .query(trx)
      .findOne({ slug: PurchaseDiscountAccount.slug, ..._extraAttrs });

    if (!result) {
      result = await this.model.query(trx).insertAndFetch({
        ...PurchaseDiscountAccount,
        ..._extraAttrs,
      });
    }
    return result;
  }

  public async findOrCreateOtherChargesAccount(
    extraAttrs: Record<string, string> = {},
    trx?: Knex.Transaction
  ) {
    // Retrieves the given tenant metadata.
    const tenantMeta = await TenantMetadata.query().findOne({
      tenantId: this.tenantId,
    });
    const _extraAttrs = {
      currencyCode: tenantMeta.baseCurrency,
      ...extraAttrs,
    };

    let result = await this.model
      .query(trx)
      .findOne({ slug: OtherChargesAccount.slug, ..._extraAttrs });

    if (!result) {
      result = await this.model.query(trx).insertAndFetch({
        ...OtherChargesAccount,
        ..._extraAttrs,
      });
    }
    return result;
  }

  public async findOrCreateOtherExpensesAccount(
    extraAttrs: Record<string, string> = {},
    trx?: Knex.Transaction
  ) {
    // Retrieves the given tenant metadata.
    const tenantMeta = await TenantMetadata.query().findOne({
      tenantId: this.tenantId,
    });
    const _extraAttrs = {
      currencyCode: tenantMeta.baseCurrency,
      ...extraAttrs,
    };

    let result = await this.model
      .query(trx)
      .findOne({ slug: OtherExpensesAccount.slug, ..._extraAttrs });

    if (!result) {
      result = await this.model.query(trx).insertAndFetch({
        ...OtherExpensesAccount,
        ..._extraAttrs,
      });
    }
    return result;
  }
}
