import Container from 'typedi';
import {
  SystemUserRepository,
  SubscriptionRepository,
  TenantRepository,
} from '@/system/repositories';

export default () => {
  const knex = Container.get('knex');
  const cache = Container.get('cache');

  return {
    systemUserRepository: new SystemUserRepository(knex, cache),
    subscriptionRepository: new SubscriptionRepository(knex, cache),
    tenantRepository: new TenantRepository(knex, cache),
  };
}