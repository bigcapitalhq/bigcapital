exports.up = function (knex) {
    return knex.schema.createTable('user_tenants', (table) => {
        table.increments();
        table.integer('user_id');
        table.integer('tenant_id');
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('user_tenants')
};
