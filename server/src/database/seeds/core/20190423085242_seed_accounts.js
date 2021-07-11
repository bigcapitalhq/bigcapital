import Container from 'typedi';
import { get } from 'lodash';
import TenancyService from 'services/Tenancy/TenancyService';
import AccountsData from '../data/accounts';

exports.up = function (knex) {
  const tenancyService = Container.get(TenancyService);
  const i18n = tenancyService.i18n(knex.userParams.tenantId);

  const data = AccountsData.map((account) => {
    return {
      ...account,
      name: i18n.__(account.name),
      description: i18n.__(account.description),
    };
  });

  return knex('accounts').then(async () => {
    // Inserts seed entries.
    return knex('accounts').insert(data);
  });
};

exports.down = function (knex) {};
