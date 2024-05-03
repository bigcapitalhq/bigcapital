import Container from 'typedi';
import {
  SystemUserRepository,
  SystemUserTenantsRepository,
  SubscriptionRepository,
  TenantRepository,
} from '@/system/repositories';

export default () => {
  const knex = Container.get('knex');
  const cache = Container.get('cache');

  return {
    systemUserRepository: new SystemUserRepository(knex, cache),
    systemUserTenantsRepository: new SystemUserTenantsRepository(knex, cache),
    subscriptionRepository: new SubscriptionRepository(knex, cache),
    tenantRepository: new TenantRepository(knex, cache),
  };
}