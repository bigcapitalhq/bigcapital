import { IModel } from '@/interfaces';
import DynamicFilterSearch from '@/lib/DynamicFilter/DynamicFilterSearch';
import { Service } from 'typedi';
import DynamicListAbstract from './DynamicListAbstract';

@Service()
export default class DynamicListSearch extends DynamicListAbstract {
  /**
   * Dynamic list filter roles.
   * @param {IModel} model
   * @param {IFilterRole[]} filterRoles
   * @returns {DynamicFilterFilterRoles}
   */
  public dynamicSearch = (model: IModel, searchKeyword: string) => {
    return new DynamicFilterSearch(searchKeyword);
  };
}
