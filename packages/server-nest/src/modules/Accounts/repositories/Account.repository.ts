import { Knex } from 'knex';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { TenantRepository } from '@/common/repository/TenantRepository';
import { TENANCY_DB_CONNECTION } from '@/modules/Tenancy/TenancyDB/TenancyDB.constants';
import { AccountModel } from '../models/Account.model';
// import { TenantMetadata } from '@/modules/System/models/TenantMetadataModel';
// import { IAccount } from '../Accounts.types';
// import {
//   PrepardExpenses,
//   StripeClearingAccount,
//   TaxPayableAccount,
//   UnearnedRevenueAccount,
// } from '../Accounts.constants';

@Injectable({ scope: Scope.REQUEST })
export class AccountRepository extends TenantRepository {
  @Inject(TENANCY_DB_CONNECTION)
  private readonly tenantDBKnex: Knex;

  /**
   * Gets the repository's model.
   */
  get model(): typeof AccountModel {
    return AccountModel.bindKnex(this.tenantDBKnex);
  }

  /**
   * Retrieve accounts dependency graph.
   * @param {string} withRelation
   * @param {Knex.Transaction} trx
   * @returns {}
   */
  public async getDependencyGraph(
    withRelation?: string,
    trx?: Knex.Transaction,
  ) {
    const accounts = await this.all(withRelation, trx);

    return this.model.toDependencyGraph(accounts);
  }

  /**
   * Retrieve account by slug.
   * @param {string} slug
   * @return {Promise<IAccount>}
   */
  public findBySlug(slug: string) {
    return this.findOne({ slug });
  }

  // /**
  //  * Changes account balance.
  //  * @param {number} accountId
  //  * @param {number} amount
  //  * @return {Promise<void>}
  //  */
  // async balanceChange(accountId: number, amount: number): Promise<void> {
  //   const method: string = amount < 0 ? 'decrement' : 'increment';

  //   await this.model.query().where('id', accountId)[method]('amount', amount);
  //   this.flushCache();
  // }

  /**
   * Activate user by the given id.
   * @param  {number} userId - User id.
   * @return {Promise<void>}
   */
  activateById(userId: number): Promise<number> {
    return super.update({ active: 1 }, { id: userId });
  }

  /**
   * Inactivate user by the given id.
   * @param  {number} userId - User id.
   * @return {Promise<void>}
   */
  inactivateById(userId: number): Promise<number> {
    return super.update({ active: 0 }, { id: userId });
  }

  /**
   * Activate user by the given id.
   * @param  {number} userId - User id.
   * @return {Promise<void>}
   */
  async activateByIds(userIds: number[], trx): Promise<number> {
    const results = await this.model
      .query(trx)
      .whereIn('id', userIds)
      .patch({ active: true });

    return results;
  }

  /**
   * Inactivate user by the given id.
   * @param  {number} userId - User id.
   * @return {Promise<void>}
   */
  async inactivateByIds(userIds: number[], trx): Promise<number> {
    const results = await this.model
      .query(trx)
      .whereIn('id', userIds)
      .patch({ active: false });

    return results;
  }

  // /**
  //  *
  //  * @param {string} currencyCode
  //  * @param extraAttrs
  //  * @param trx
  //  * @returns
  //  */
  // findOrCreateAccountReceivable = async (
  //   currencyCode: string = '',
  //   extraAttrs = {},
  //   trx?: Knex.Transaction,
  // ) => {
  //   let result = await this.model
  //     .query(trx)
  //     .onBuild((query) => {
  //       if (currencyCode) {
  //         query.where('currencyCode', currencyCode);
  //       }
  //       query.where('accountType', 'accounts-receivable');
  //     })
  //     .first();

  //   if (!result) {
  //     result = await this.model.query(trx).insertAndFetch({
  //       name: this.i18n.__('account.accounts_receivable.currency', {
  //         currency: currencyCode,
  //       }),
  //       accountType: 'accounts-receivable',
  //       currencyCode,
  //       active: 1,
  //       ...extraAttrs,
  //     });
  //   }
  //   return result;
  // };

  // /**
  //  * Find or create tax payable account.
  //  * @param {Record<string, string>}extraAttrs
  //  * @param {Knex.Transaction} trx
  //  * @returns
  //  */
  // async findOrCreateTaxPayable(
  //   extraAttrs: Record<string, string> = {},
  //   trx?: Knex.Transaction,
  // ) {
  //   let result = await this.model
  //     .query(trx)
  //     .findOne({ slug: TaxPayableAccount.slug, ...extraAttrs });

  //   if (!result) {
  //     result = await this.model.query(trx).insertAndFetch({
  //       ...TaxPayableAccount,
  //       ...extraAttrs,
  //     });
  //   }
  //   return result;
  // }

  // findOrCreateAccountsPayable = async (
  //   currencyCode: string = '',
  //   extraAttrs = {},
  //   trx?: Knex.Transaction,
  // ) => {
  //   let result = await this.model
  //     .query(trx)
  //     .onBuild((query) => {
  //       if (currencyCode) {
  //         query.where('currencyCode', currencyCode);
  //       }
  //       query.where('accountType', 'accounts-payable');
  //     })
  //     .first();

  //   if (!result) {
  //     result = await this.model.query(trx).insertAndFetch({
  //       name: this.i18n.__('account.accounts_payable.currency', {
  //         currency: currencyCode,
  //       }),
  //       accountType: 'accounts-payable',
  //       currencyCode,
  //       active: 1,
  //       ...extraAttrs,
  //     });
  //   }
  //   return result;
  // };

  // /**
  //  * Finds or creates the unearned revenue.
  //  * @param {Record<string, string>} extraAttrs
  //  * @param {Knex.Transaction} trx
  //  * @returns
  //  */
  // public async findOrCreateUnearnedRevenue(
  //   extraAttrs: Record<string, string> = {},
  //   trx?: Knex.Transaction,
  // ) {
  //   // Retrieves the given tenant metadata.
  //   const tenantMeta = await TenantMetadata.query().findOne({
  //     tenantId: this.tenantId,
  //   });
  //   const _extraAttrs = {
  //     currencyCode: tenantMeta.baseCurrency,
  //     ...extraAttrs,
  //   };
  //   let result = await this.model
  //     .query(trx)
  //     .findOne({ slug: UnearnedRevenueAccount.slug, ..._extraAttrs });

  //   if (!result) {
  //     result = await this.model.query(trx).insertAndFetch({
  //       ...UnearnedRevenueAccount,
  //       ..._extraAttrs,
  //     });
  //   }
  //   return result;
  // }

  // /**
  //  * Finds or creates the prepard expenses account.
  //  * @param {Record<string, string>} extraAttrs
  //  * @param {Knex.Transaction} trx
  //  * @returns
  //  */
  // public async findOrCreatePrepardExpenses(
  //   extraAttrs: Record<string, string> = {},
  //   trx?: Knex.Transaction,
  // ) {
  //   // Retrieves the given tenant metadata.
  //   const tenantMeta = await TenantMetadata.query().findOne({
  //     tenantId: this.tenantId,
  //   });
  //   const _extraAttrs = {
  //     currencyCode: tenantMeta.baseCurrency,
  //     ...extraAttrs,
  //   };

  //   let result = await this.model
  //     .query(trx)
  //     .findOne({ slug: PrepardExpenses.slug, ..._extraAttrs });

  //   if (!result) {
  //     result = await this.model.query(trx).insertAndFetch({
  //       ...PrepardExpenses,
  //       ..._extraAttrs,
  //     });
  //   }
  //   return result;
  // }

  // /**
  //  * Finds or creates the stripe clearing account.
  //  * @param {Record<string, string>} extraAttrs
  //  * @param {Knex.Transaction} trx
  //  * @returns
  //  */
  // public async findOrCreateStripeClearing(
  //   extraAttrs: Record<string, string> = {},
  //   trx?: Knex.Transaction,
  // ) {
  //   // Retrieves the given tenant metadata.
  //   const tenantMeta = await TenantMetadata.query().findOne({
  //     tenantId: this.tenantId,
  //   });
  //   const _extraAttrs = {
  //     currencyCode: tenantMeta.baseCurrency,
  //     ...extraAttrs,
  //   };
  //   let result = await this.model
  //     .query(trx)
  //     .findOne({ slug: StripeClearingAccount.slug, ..._extraAttrs });

  //   if (!result) {
  //     result = await this.model.query(trx).insertAndFetch({
  //       ...StripeClearingAccount,
  //       ..._extraAttrs,
  //     });
  //   }
  //   return result;
  // }
}
