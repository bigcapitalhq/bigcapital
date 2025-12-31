/**
 * Data migration to populate taxable_amount for existing items_entries_taxes records.
 * This calculates the taxable base from the associated items_entries.
 */
exports.up = async function (knex) {
  // Update taxable_amount based on the entry's amount after discount
  // Formula: (quantity * rate) - discount_amount
  // Where discount_amount = (quantity * rate) * (discount / 100) for percentage, or discount for fixed amount
  await knex.raw(`
    UPDATE ITEMS_ENTRIES_TAXES iet
    INNER JOIN ITEMS_ENTRIES ie ON iet.ITEM_ENTRY_ID = ie.ID
    SET iet.TAXABLE_AMOUNT = CASE
      WHEN ie.DISCOUNT_TYPE = 'percentage' THEN
        (ie.QUANTITY * ie.RATE) - ((ie.QUANTITY * ie.RATE) * COALESCE(ie.DISCOUNT, 0) / 100)
      ELSE
        (ie.QUANTITY * ie.RATE) - COALESCE(ie.DISCOUNT, 0)
    END
    WHERE iet.TAXABLE_AMOUNT IS NULL OR iet.TAXABLE_AMOUNT = 0
  `);
};

exports.down = async function (knex) {
  // Reset taxable_amount to NULL (optional, but keeps migration reversible)
  await knex.raw('UPDATE ITEMS_ENTRIES_TAXES SET TAXABLE_AMOUNT = NULL');
};
