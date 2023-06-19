import { Service } from 'typedi';
import { IFilterRole, IModel } from '@/interfaces';
import DynamicListAbstract from './DynamicListAbstract';
import DynamicFilterFilterRoles from '@/lib/DynamicFilter/DynamicFilterFilterRoles';
import DynamicFilterSearch from '@/lib/DynamicFilter/DynamicFilterSearch';

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
