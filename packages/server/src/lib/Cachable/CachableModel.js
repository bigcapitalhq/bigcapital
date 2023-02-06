import BaseModel from 'models/Model';
import CacheService from '@/services/Cache';

export default (Model) => {
  return class CachableModel extends Model{
    static flushCache(key) {
      const modelName = this.name;

      if (key) {
        CacheService.del(`${modelName}.${key}`);
      } else {
        CacheService.delStartWith(modelName);
      }
    }
  };
} 