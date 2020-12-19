
exports.up = (knex) => {
  // Deletes ALL existing entries
  return knex('view_roles').del()
    .then(() => {
      // Inserts seed entries
      return knex('view_roles').insert([
        // Accounts
        { field_key: 'type', index: 1, comparator: 'equals', value: 'asset', view_id: 1 },
        { field_key: 'type', index: 1, comparator: 'equals', value: 'liability', view_id: 2 }, 
        { field_key: 'type', index: 1, comparator: 'equals', value: 'equity', view_id: 3 }, 
        { field_key: 'type', index: 1, comparator: 'equals', value: 'income', view_id: 4 }, 
        { field_key: 'type', index: 1, comparator: 'equals', value: 'expense', view_id: 5 }, 
        { field_key: 'active', index: 1, comparator: 'is', value: 1, view_id: 15 },

        // Items.
        { field_key: 'type', index: 1, comparator: 'equals', value: 'service', view_id: 6 },
        { field_key: 'type', index: 1, comparator: 'equals', value: 'inventory', view_id: 7 },
        { field_key: 'type', index: 1, comparator: 'equals', value: 'non-inventory', view_id: 8 },

        // Manual Journals.
        { field_key: 'journal_type', index: 1, comparator: 'equals', value: 'Journal', view_id: 9 },
        { field_key: 'journal_type', index: 1, comparator: 'equals', value: 'CreditNote', view_id: 10 },
        { field_key: 'journal_type', index: 1, comparator: 'equals', value: 'Reconciliation', view_id: 11 },

        // Sale invoice.
        { field_key: 'status', index: 1, comparator: 'is', value: 'draft', view_id: 16 },
        { field_key: 'status', index: 1, comparator: 'is', value: 'delivered', view_id: 17 },
        { field_key: 'status', index: 1, comparator: 'is', value: 'unpaid', view_id: 18 },
        { field_key: 'status', index: 1, comparator: 'is', value: 'overdue', view_id: 19 },
        { field_key: 'status', index: 1, comparator: 'is', value: 'partially-paid', view_id: 20 },
        { field_key: 'status', index: 1, comparator: 'is', value: 'paid', view_id: 21 },

        // Bills
        { field_key: 'status', index: 1, comparator: 'is', value: 'draft', view_id: 22 },
        { field_key: 'status', index: 1, comparator: 'is', value: 'opened', view_id: 23 },
        { field_key: 'status', index: 1, comparator: 'is', value: 'unpaid', view_id: 24 },
        { field_key: 'status', index: 1, comparator: 'is', value: 'overdue', view_id: 25 },
        { field_key: 'status', index: 1, comparator: 'is', value: 'partially-paid', view_id: 26 },
        { field_key: 'status', index: 1, comparator: 'is', value: 'paid', view_id: 27 },

        // Sale estimates
        { field_key: 'status', index: 1, comparator: 'is', value: 'draft', view_id: 28 },
        { field_key: 'status', index: 1, comparator: 'is', value: 'delivered', view_id: 29 },
        { field_key: 'status', index: 1, comparator: 'is', value: 'approved', view_id: 30 },
        { field_key: 'status', index: 1, comparator: 'is', value: 'rejected', view_id: 31 },
        { field_key: 'status', index: 1, comparator: 'is', value: 'invoiced', view_id: 32 },
        { field_key: 'status', index: 1, comparator: 'is', value: 'expired', view_id: 33 },
  
        // Sale receipts.
        { field_key: 'status', index: 1, comparator: 'is', value: 'draft', view_id: 34 },
        { field_key: 'status', index: 1, comparator: 'is', value: 'closed', view_id: 35 },
      ]);
    });
};

exports.down = (knex) => {

}