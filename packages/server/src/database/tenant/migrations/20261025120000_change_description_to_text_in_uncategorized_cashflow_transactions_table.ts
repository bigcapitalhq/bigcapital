exports.up = function (knex) {
  return knex.schema.table('uncategorized_cashflow_transactions', (table) => {
    table.text('description').alter();
  });
};

exports.down = async function (knex) {
  // Narrowing the column back to `varchar(255)` requires shortening values
  // that exceed the original length limit.
  await knex('uncategorized_cashflow_transactions')
    .whereRaw('CHAR_LENGTH(description) > 255')
    .update({ description: knex.raw('LEFT(description, 255)') });

  return knex.schema.table('uncategorized_cashflow_transactions', (table) => {
    table.string('description').alter();
  });
};
