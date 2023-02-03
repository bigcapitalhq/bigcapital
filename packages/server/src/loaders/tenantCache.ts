import { Container } from 'typedi';
import Cache from '@/services/Cache';

export default (tenantId: number) => {
  const cacheInstance = new Cache();

  return cacheInstance;
};