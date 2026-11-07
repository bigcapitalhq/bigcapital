import { Injectable } from '@nestjs/common';
import { DynamicFilterSearch } from './DynamicFilter/DynamicFilterSearch';
import { DynamicListServiceAbstract } from './DynamicListServiceAbstract';
import { ISearchRole } from './DynamicFilter/DynamicFilter.types';

@Injectable()
export class DynamicListSearch extends DynamicListServiceAbstract {
  /**
   * Dynamic list filter roles.
   * @param {string} searchKeyword - Search keyword.
   * @param {ISearchRole[]} extraSearchRoles - Additional search roles.
   * @returns {DynamicFilterFilterRoles}
   */
  public dynamicSearch = (
    searchKeyword: string,
    extraSearchRoles: ISearchRole[] = [],
  ) => {
    return new DynamicFilterSearch(searchKeyword, extraSearchRoles);
  };
}
