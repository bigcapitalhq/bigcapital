import { Injectable } from '@nestjs/common';
import { DynamicFilterSearch } from './DynamicFilter/DynamicFilterSearch';
import { DynamicListServiceAbstract } from './DynamicListServiceAbstract';

@Injectable()
export class DynamicListSearch extends DynamicListServiceAbstract {
  /**
   * Dynamic list filter roles.
   * @param {string} searchKeyword - Search keyword.
   * @returns {DynamicFilterFilterRoles}
   */
  public dynamicSearch = (searchKeyword: string) => {
    return new DynamicFilterSearch(searchKeyword);
  };
}
