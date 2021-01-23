import Container from 'typedi';
import { get }  from 'lodash';
import TenancyService from 'services/Tenancy/TenancyService'
import AccountsData from '../data/accounts';

exports.up = function (knex) {
  return knex('accounts').then(async () => {
    // Inserts seed entries.
    return knex('accounts').insert([ ...AccountsData ]);
  });
};

exports.down = function (knex) {
  
};
