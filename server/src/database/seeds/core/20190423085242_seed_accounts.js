import Container from 'typedi';
import { get }  from 'lodash';
import TenancyService from 'services/Tenancy/TenancyService'
import AccountsData from '../data/accounts';


exports.up = function (knex) {
  const tenancyService = Container.get(TenancyService);
  const i18n = tenancyService.i18n(knex.userParams.tenantId);

  const accountMapper = (account) => {
    return knex('account_types').where('key', account.account_type).first()
      .then((accountType) => ({
        name: i18n.__(account.name),
        slug: account.slug,
        account_type_id: get(accountType, 'id', null),
        code: account.code,
        description: i18n.__(account.description),
        active: 1,
        index: 1,
        predefined: account.predefined,
      }));
  };
  return knex('accounts').then(async () => {
    const accountsPromises = AccountsData.map(accountMapper);
    const accounts = await Promise.all(accountsPromises);

    // Inserts seed entries.
    return knex('accounts').insert([ ...accounts ]);
  });
};

exports.down = function (knex) {
  
};
