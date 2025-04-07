exports.up = (knex) => {
  return knex.schema
    .raw(
      'ALTER TABLE CONTACTS CHANGE SHIPPING_ADDRESS_1 SHIPPING_ADDRESS1 VARCHAR(255)'
    )
    .raw(
      'ALTER TABLE CONTACTS CHANGE SHIPPING_ADDRESS_2 SHIPPING_ADDRESS2 VARCHAR(255)'
    )
    .raw(
      'ALTER TABLE CONTACTS CHANGE BILLING_ADDRESS_1 BILLING_ADDRESS1 VARCHAR(255)'
    )
    .raw(
      'ALTER TABLE CONTACTS CHANGE BILLING_ADDRESS_2 BILLING_ADDRESS2 VARCHAR(255)'
    );
};

exports.down = (knex) => {
  return knex.schema.table('contacts', (table) => {});
};
