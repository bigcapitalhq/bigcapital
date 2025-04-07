import { BaseModel } from '@/models/Model';

type GConstructor<T = {}> = new (...args: any[]) => T;

export const ResourceableModelMixin = <T extends GConstructor<BaseModel>>(
  Model: T,
) =>
  class ResourceableModel extends Model {
    static get resourceable() {
      return true;
    }
  };
