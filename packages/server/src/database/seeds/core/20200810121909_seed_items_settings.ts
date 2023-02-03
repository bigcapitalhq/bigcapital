import { TenantSeeder } from '@/lib/Seeder/TenantSeeder';

export default class SeedSettings extends TenantSeeder {
  /**
   * 
   * @param knex 
   * @returns 
   */
  async up(knex) {
    const costAccount = await knex('accounts')
      .where('slug', 'cost-of-goods-sold')
      .first();

    const sellAccount = await knex('accounts')
      .where('slug', 'sales-of-product-income')
      .first();

    const inventoryAccount = await knex('accounts')
      .where('slug', 'inventory-asset')
      .first();

    const settings = [
      // Items settings.
      { group: 'items', key: 'preferred_sell_account', value: sellAccount?.id },
      { group: 'items', key: 'preferred_cost_account', value: costAccount?.id },
      {
        group: 'items',
        key: 'preferred_inventory_account',
        value: inventoryAccount?.id,
      },
    ];
    return knex('settings').insert(settings);
  }
}
