/**
 * Seeds the default customer/vendor number settings.
 * New tenants receive the same rows from this migration; keep the defaults
 * in sync with the customer/vendor number preferences page.
 */
const DEFAULT_CONTACT_NUMBER_SETTINGS = [
  { group: 'customers', key: 'number_prefix', value: 'CUST-' },
  { group: 'customers', key: 'next_number', value: '00001' },
  { group: 'customers', key: 'auto_increment', value: '1' },
  { group: 'vendors', key: 'number_prefix', value: 'VEND-' },
  { group: 'vendors', key: 'next_number', value: '00001' },
  { group: 'vendors', key: 'auto_increment', value: '1' },
];

exports.up = async function (knex) {
  for (const setting of DEFAULT_CONTACT_NUMBER_SETTINGS) {
    const existingSetting = await knex('settings')
      .where({ group: setting.group, key: setting.key })
      .first();

    if (!existingSetting) {
      await knex('settings').insert(setting);
    }
  }
};

exports.down = async function (_knex) {
  // Data migration only; leave settings untouched on rollback.
  return Promise.resolve();
};
