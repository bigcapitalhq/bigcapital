import Container from 'typedi';
import {
  SystemUserRepository,
  SubscriptionRepository,
  TenantRepository,
} from 'system/repositories';

export default () => {
  return {
    systemUserRepository: Container.get(SystemUserRepository),
    subscriptionRepository: Container.get(SubscriptionRepository),
    tenantRepository: Container.get(TenantRepository),
  };
}