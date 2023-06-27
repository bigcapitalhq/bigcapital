import { TenantSeeder } from '@/lib/Seeder/TenantSeeder';

export default class SeedRolesAndPermissions extends TenantSeeder {
  /**
   * Seeds roles and associated permissions.
   * @param knex
   * @returns
   */
  // eslint-disable-next-line class-methods-use-this
  async up(knex) {
    return knex('roles').insert([
      {
        id: 1,
        name: 'role.admin.name',
        predefined: true,
        slug: 'admin',
        description: 'role.admin.desc',
      },
      {
        id: 2,
        name: 'role.staff.name',
        predefined: true,
        slug: 'staff',
        description: 'role.staff.desc',
      },
    ]);
  }
}
