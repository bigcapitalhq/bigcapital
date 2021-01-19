import Container from 'typedi';
import TenancyService from 'services/Tenancy/TenancyService'
import I18nMiddleware from 'api/middleware/I18nMiddleware';
import AccountsTypesData from '../data/accounts_types';

exports.up = function (knex) {
  return knex('account_types').insert([
    ...AccountsTypesData
  ]);
};

exports.down = function(knex) {
  
}