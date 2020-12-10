import Container from 'typedi';
import TenancyService from 'services/Tenancy/TenancyService'
import I18nMiddleware from 'api/middleware/I18nMiddleware';

exports.up = function (knex) {
  const tenancyService = Container.get(TenancyService);
  const i18n = tenancyService.i18n(knex.userParams.tenantId);

  return knex('account_types').insert([
    {
      id: 1,
      key: 'fixed_asset',
      normal: 'debit',
      root_type: 'asset',
      child_type: 'fixed_asset',
      balance_sheet: true,
      income_sheet: false,
    },
    {
      id: 2,
      key: 'current_asset',
      normal: 'debit',
      root_type: 'asset',
      child_type: 'current_asset',
      balance_sheet: true,
      income_sheet: false,
    },
    {
      id: 14,
      key: 'other_asset',
      normal: 'debit',
      root_type: 'asset',
      child_type: 'other_asset',
      balance_sheet: true,
      income_sheet: false,
    },
    {
      id: 3,
      key: 'long_term_liability',
      normal: 'credit',
      root_type: 'liability',
      child_type: 'long_term_liability',
      balance_sheet: false,
      income_sheet: true,
    },
    {
      id: 4,
      key: 'current_liability',
      normal: 'credit',
      root_type: 'liability',
      child_type: 'current_liability',
      balance_sheet: false,
      income_sheet: true,
    },
    {
      id: 13,
      key: 'other_liability',
      normal: 'credit',
      root_type: 'liability',
      child_type: 'other_liability',
      balance_sheet: false,
      income_sheet: true,
    },
    {
      id: 5,
      key: 'equity',
      normal: 'credit',
      root_type: 'equity',
      child_type: 'equity',
      balance_sheet: true,
      income_sheet: false,
    },
    {
      id: 6,
      key: 'expense',
      normal: 'debit',
      root_type: 'expense',
      child_type: 'expense',
      balance_sheet: false,
      income_sheet: true,
    },
    {
      id: 10,
      key: 'other_expense',
      normal: 'debit',
      root_type: 'expense',
      balance_sheet: false,
      income_sheet: true,
    },
    {
      id: 7,
      key: 'income',
      normal: 'credit',
      root_type: 'income',
      child_type: 'income',
      balance_sheet: false,
      income_sheet: true,
    },
    {
      id: 11,
      key: 'other_income',
      normal: 'credit',
      root_type: 'income',
      child_type: 'other_income',
      balance_sheet: false,
      income_sheet: true,
    },
    {
      id: 12,
      key: 'cost_of_goods_sold',
      normal: 'debit',
      root_type: 'expenses',
      child_type: 'expenses',
      balance_sheet: false,
      income_sheet: true,
    },
    {
      id: 8,
      key: 'accounts_receivable',
      normal: 'debit',
      root_type: 'asset',
      child_type: 'current_asset',
      balance_sheet: true,
      income_sheet: false,
    },
    {
      id: 9,
      key: 'accounts_payable',
      normal: 'credit',
      root_type: 'liability',
      child_type: 'current_liability',
      balance_sheet: true,
      income_sheet: false,
    },
  ]);
};


exports.down = function(knex) {
  
}