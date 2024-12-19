import { Injectable } from '@nestjs/common';
import { DynamicListAbstract } from './DynamicListAbstract';
import { DynamicFilterSearch } from './DynamicFilter/DynamicFilterSearch';

@Injectable()
export class DynamicListSearch extends DynamicListAbstract {
  /**
   * Dynamic list filter roles.
   * @param {string} searchKeyword - Search keyword.
   * @returns {DynamicFilterFilterRoles}
   */
  public dynamicSearch = (searchKeyword: string) => {
    return new DynamicFilterSearch(searchKeyword);
  };
}
