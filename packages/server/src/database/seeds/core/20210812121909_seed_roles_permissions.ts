import { TenantSeeder } from '@/lib/Seeder/TenantSeeder';

export default class SeedRolesAndPermissions extends TenantSeeder {
  /**
   * Seeds roles and associated permissions.
   * @param knex
   * @returns
   */
  // eslint-disable-next-line class-methods-use-this
  async up(knex) {
    return knex('role_permissions').insert([
      // Assign sale invoice permissions to staff role.
      { roleId: 2, subject: 'SaleInvoice', ability: 'create' },
      { roleId: 2, subject: 'SaleInvoice', ability: 'delete' },
      { roleId: 2, subject: 'SaleInvoice', ability: 'view' },
      { roleId: 2, subject: 'SaleInvoice', ability: 'edit' },

      // Assign sale estimate permissions to staff role.
      { roleId: 2, subject: 'SaleEstimate', ability: 'create' },
      { roleId: 2, subject: 'SaleEstimate', ability: 'delete' },
      { roleId: 2, subject: 'SaleEstimate', ability: 'view' },
      { roleId: 2, subject: 'SaleEstimate', ability: 'edit' },

      // Assign sale receipt permissions to staff role.
      { roleId: 2, subject: 'SaleReceipt', ability: 'create' },
      { roleId: 2, subject: 'SaleReceipt', ability: 'delete' },
      { roleId: 2, subject: 'SaleReceipt', ability: 'view' },
      { roleId: 2, subject: 'SaleReceipt', ability: 'edit' },

      // Assign payment receive permissions to staff role.
      { roleId: 2, subject: 'PaymentReceive', ability: 'create' },
      { roleId: 2, subject: 'PaymentReceive', ability: 'delete' },
      { roleId: 2, subject: 'PaymentReceive', ability: 'view' },
      { roleId: 2, subject: 'PaymentReceive', ability: 'edit' },

      // Assign bill permissions to staff role.
      { roleId: 2, subject: 'Bill', ability: 'create' },
      { roleId: 2, subject: 'Bill', ability: 'delete' },
      { roleId: 2, subject: 'Bill', ability: 'view' },
      { roleId: 2, subject: 'Bill', ability: 'edit' },

      // Assign payment made permissions to staff role.
      { roleId: 2, subject: 'PaymentMade', ability: 'create' },
      { roleId: 2, subject: 'PaymentMade', ability: 'delete' },
      { roleId: 2, subject: 'PaymentMade', ability: 'view' },
      { roleId: 2, subject: 'PaymentMade', ability: 'edit' },
    ]);
  }
}
