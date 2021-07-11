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
        { id: 15, name: i18n.__('Inactive'), slug: 'inactive', roles_logic_expression: '1', resource_model: 'Account', predefined: true },
        { id: 1, name: i18n.__('Assets'), slug: 'assets', roles_logic_expression: '1', resource_model: 'Account', predefined: true },
        { id: 2, name: i18n.__('Liabilities'), slug: 'liabilities', roles_logic_expression: '1', resource_model: 'Account', predefined: true },
        { id: 3, name: i18n.__('Equity'), slug: 'equity', roles_logic_expression: '1', resource_model: 'Account', predefined: true },
        { id: 4, name: i18n.__('Income'), slug: 'income', roles_logic_expression: '1', resource_model: 'Account', predefined: true },
        { id: 5, name: i18n.__('Expenses'), slug: 'expenses', roles_logic_expression: '1', resource_model: 'Account', predefined: true },

        // Items.
        { id: 6, name: i18n.__('Services'), slug: 'services', roles_logic_expression: '1', resource_model: 'Item', predefined: true },
        { id: 7, name: i18n.__('Inventory'), slug: 'inventory', roles_logic_expression: '1', resource_model: 'Item', predefined: true },
        { id: 8, name: i18n.__('Non-Inventory'), slug: 'non-inventory', roles_logic_expression: '1', resource_model: 'Item', predefined: true },

        // Manual Journals
        { id: 9, name: i18n.__('Journal'), roles_logic_expression: '1', resource_model: 'ManualJournal', predefined: true },
        { id: 10, name: i18n.__('Credit'), roles_logic_expression: '1', resource_model: 'ManualJournal', predefined: true },
        { id: 11, name: i18n.__('Reconciliation'), roles_logic_expression: '1', resource_model: 'ManualJournal', predefined: true },

        // Expenses.
        { id: 12, name: i18n.__('Draft'), slug: 'draft', roles_logic_expression: '1', resource_model: 'Expense', predefined: true, },
        { id: 13, name: i18n.__('Published'), slug: 'published', roles_logic_expression: '1', resource_model: 'Expense', predefined: true, },

        // Sales invoices.
        { id: 16, name: i18n.__('Draft'), slug: 'draft', roles_logic_expression: '1', resource_model: 'SaleInvoice', predefined: true, },
        { id: 17, name: i18n.__('Delivered'), slug: 'delivered', roles_logic_expression: '1', resource_model: 'SaleInvoice', predefined: true },
        { id: 18, name: i18n.__('Unpaid'), slug: 'unpaid', roles_logic_expression: '1', resource_model: 'SaleInvoice', predefined: true },
        { id: 19, name: i18n.__('Overdue'), slug: 'overdue', roles_logic_expression: '1', resource_model: 'SaleInvoice', predefined: true },
        { id: 20, name: i18n.__('Partially paid'), slug: 'partially-paid', roles_logic_expression: '1', resource_model: 'SaleInvoice', predefined: true },
        { id: 21, name: i18n.__('Paid'), slug: 'paid', roles_logic_expression: '1', resource_model: 'SaleInvoice', predefined: true },

        // Bills.
        { id: 22, name: i18n.__('Draft'), slug: 'draft', roles_logic_expression: '1', resource_model: 'Bill', predefined: true, },
        { id: 23, name: i18n.__('Opened'), slug: 'opened', roles_logic_expression: '1', resource_model: 'Bill', predefined: true },
        { id: 24, name: i18n.__('Unpaid'), slug: 'unpaid', roles_logic_expression: '1', resource_model: 'Bill', predefined: true },
        { id: 25, name: i18n.__('Overdue'), slug: 'overdue', roles_logic_expression: '1', resource_model: 'Bill', predefined: true },
        { id: 26, name: i18n.__('Partially paid'), slug: 'partially-paid', roles_logic_expression: '1', resource_model: 'Bill', predefined: true },
        { id: 27, name: i18n.__('Paid'), slug: 'paid', roles_logic_expression: '1', resource_model: 'Bill', predefined: true },

        // Sale estimate.
        { id: 28, name: i18n.__('Draft'), slug: 'draft', roles_logic_expression: '1', resource_model: 'SaleEstimate', predefined: true },
        { id: 29, name: i18n.__('Delivered'), slug: 'delivered', roles_logic_expression: '1', resource_model: 'SaleEstimate', predefined: true },
        { id: 30, name: i18n.__('Approved'), slug: 'approved', roles_logic_expression: '1', resource_model: 'SaleEstimate', predefined: true },
        { id: 31, name: i18n.__('Rejected'), slug: 'rejected', roles_logic_expression: '1', resource_model: 'SaleEstimate', predefined: true },
        { id: 32, name: i18n.__('Invoiced'), slug: 'invoiced', roles_logic_expression: '1', resource_model: 'SaleEstimate', predefined: true },
        { id: 33, name: i18n.__('Expired'), slug: 'expired', roles_logic_expression: '1', resource_model: 'SaleEstimate', predefined: true },

        // Sale receipts.
        { id: 34, name: i18n.__('Draft'), slug: 'draft', roles_logic_expression: '1', resource_model: 'SaleReceipt', predefined: true },
        { id: 35, name: i18n.__('Closed'), slug: 'closed', roles_logic_expression: '1', resource_model: 'SaleReceipt', predefined: true },

        // Customers
        { id: 36, name: i18n.__('Active'), slug: 'active', roles_logic_expression: '1', resource_model: 'Customer', predefined: true },
        { id: 37, name: i18n.__('Inactive'), slug: 'inactive', roles_logic_expression: '1', resource_model: 'Customer', predefined: true },
        { id: 38, name: i18n.__('Overdue'), slug: 'overdue', roles_logic_expression: '1', resource_model: 'Customer', predefined: true },
        { id: 39, name: i18n.__('Unpaid'), slug: 'inpaid', roles_logic_expression: '1', resource_model: 'Customer', predefined: true },

        // Vendors
        { id: 40, name: i18n.__('Active'), slug: 'active', roles_logic_expression: '1', resource_model: 'Vendor', predefined: true },
        { id: 41, name: i18n.__('Inactive'), slug: 'inactive', roles_logic_expression: '1', resource_model: 'Vendor', predefined: true },
        { id: 42, name: i18n.__('Overdue'), slug: 'overdue', roles_logic_expression: '1', resource_model: 'Vendor', predefined: true },
        { id: 43, name: i18n.__('Unpaid'), slug: 'overdue', roles_logic_expression: '1', resource_model: 'Vendor', predefined: true },
      ]);
    });
};


exports.down = (knex) => {

};