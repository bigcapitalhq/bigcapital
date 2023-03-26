import { Service } from 'typedi';
import { IFilterRole, IModel } from '@/interfaces';
import DynamicListAbstruct from './DynamicListAbstruct';
import DynamicFilterFilterRoles from '@/lib/DynamicFilter/DynamicFilterFilterRoles';
import DynamicFilterSearch from '@/lib/DynamicFilter/DynamicFilterSearch';

@Service()
export default class DynamicListSearch extends DynamicListAbstruct {
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
