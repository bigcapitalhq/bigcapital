import Container from 'typedi';
import TenancyService from 'services/Tenancy/TenancyService';

exports.up = (knex) => {
  const tenancyService = Container.get(TenancyService);
  const i18n = tenancyService.i18n(knex.userParams.tenantId);

  // Deletes ALL existing entries
  return knex('views').del()
    .then(() => {
      // Inserts seed entries
      return knex('views').insert([
        // Accounts.
        { id: 15, name: i18n.__('Inactive'), roles_logic_expression: '1', resource_model: 'Account', predefined: true },
        { id: 1, name: i18n.__('Assets'), roles_logic_expression: '1', resource_model: 'Account', predefined: true },
        { id: 2, name: i18n.__('Liabilities'), roles_logic_expression: '1', resource_model: 'Account', predefined: true },
        { id: 3, name: i18n.__('Equity'), roles_logic_expression: '1', resource_model: 'Account', predefined: true },
        { id: 4, name: i18n.__('Income'), roles_logic_expression: '1', resource_model: 'Account', predefined: true },
        { id: 5, name: i18n.__('Expenses'), roles_logic_expression: '1', resource_model: 'Account', predefined: true },

        // Items.
        { id: 6, name: i18n.__('Services'), roles_logic_expression: '1', resource_model: 'Item', predefined: true },
        { id: 7, name: i18n.__('Inventory'), roles_logic_expression: '1', resource_model: 'Item', predefined: true },
        { id: 8, name: i18n.__('Non-Inventory'), roles_logic_expression: '1', resource_model: 'Item', predefined: true },

        // Manual Journals
        { id: 9, name: i18n.__('Journal'), roles_logic_expression: '1', resource_model: 'ManualJournal', predefined: true },
        { id: 10, name: i18n.__('Credit'), roles_logic_expression: '1', resource_model: 'ManualJournal', predefined: true },
        { id: 11, name: i18n.__('Reconciliation'), roles_logic_expression: '1', resource_model: 'ManualJournal', predefined: true },

        // Expenses.
        { id: 12, name: i18n.__('Interest'), roles_logic_expression: '1', resource_model: 'Expense', predefined: false, },
        { id: 13, name: i18n.__('Depreciation'), roles_logic_expression: '1', resource_model: 'Expense', predefined: false, },
        { id: 14, name: i18n.__('Payroll'), roles_logic_expression: '1', resource_model: 'Expense', predefined: false },

        // Sales invoices.
        { id: 16, name: 'Draft', slug: 'draft', roles_logic_expression: '1', resource_model: 'SaleInvoice', predefined: true, },
        { id: 17, name: 'Delivered', slug: 'delivered', roles_logic_expression: '1', resource_model: 'SaleInvoice', predefined: true },
        { id: 18, name: 'Unpaid', slug: 'unpaid', roles_logic_expression: '1', resource_model: 'SaleInvoice', predefined: true },
        { id: 19, name: 'Overdue', slug: 'overdue', roles_logic_expression: '1', resource_model: 'SaleInvoice', predefined: true },
        { id: 20, name: 'Partially paid', slug: 'partially-paid', roles_logic_expression: '1', resource_model: 'SaleInvoice', predefined: true },
        { id: 21, name: 'Paid', slug: 'paid', roles_logic_expression: '1', resource_model: 'SaleInvoice', predefined: true },

        // Bills.
        { id: 22, name: 'Draft', slug: 'draft', roles_logic_expression: '1', resource_model: 'Bill', predefined: true, },
        { id: 23, name: 'Opened', slug: 'opened', roles_logic_expression: '1', resource_model: 'Bill', predefined: true },
        { id: 24, name: 'Unpaid', slug: 'unpaid', roles_logic_expression: '1', resource_model: 'Bill', predefined: true },
        { id: 25, name: 'Overdue', slug: 'overdue', roles_logic_expression: '1', resource_model: 'Bill', predefined: true },
        { id: 26, name: 'Partially paid', slug: 'partially-paid', roles_logic_expression: '1', resource_model: 'Bill', predefined: true },
        { id: 27, name: 'Paid', slug: 'paid', roles_logic_expression: '1', resource_model: 'Bill', predefined: true },

        // Sale estimate.
        { id: 28, name: 'Draft', slug: 'draft', roles_logic_expression: '1', resource_model: 'SaleEstimate', predefined: true },
        { id: 29, name: 'Delivered', slug: 'delivered', roles_logic_expression: '1', resource_model: 'SaleEstimate', predefined: true },
        { id: 30, name: 'Approved', slug: 'approved', roles_logic_expression: '1', resource_model: 'SaleEstimate', predefined: true },
        { id: 31, name: 'Rejected', slug: 'rejected', roles_logic_expression: '1', resource_model: 'SaleEstimate', predefined: true },
        { id: 32, name: 'Invoiced', slug: 'invoiced', roles_logic_expression: '1', resource_model: 'SaleEstimate', predefined: true },
        { id: 33, name: 'Expired', slug: 'expired', roles_logic_expression: '1', resource_model: 'SaleEstimate', predefined: true },
      ]);
    });
};


exports.down = (knex) => {

};