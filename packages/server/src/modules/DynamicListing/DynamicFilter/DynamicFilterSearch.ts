import { IFilterRole, ISearchRole } from './DynamicFilter.types';
import { DynamicFilterFilterRoles } from './DynamicFilterFilterRoles';

export interface IDynamicFilterSearchResponseMeta {
  searchKeyword: string;
}

export class DynamicFilterSearch extends DynamicFilterFilterRoles {
  private searchKeyword: string;
  private extraSearchRoles: ISearchRole[];

  /**
   * Constructor method.
   * @param {string} searchKeyword - Search keyword.
   * @param {ISearchRole[]} extraSearchRoles - Additional search roles.
   */
  constructor(searchKeyword: string, extraSearchRoles: ISearchRole[] = []) {
    super();
    this.searchKeyword = searchKeyword;
    this.extraSearchRoles = extraSearchRoles;
  }

  /**
   * On initialize the dynamic filter.
   */
  public onInitialize() {
    super.onInitialize();
    this.filterRoles = this.getModelSearchFilterRoles(this.searchKeyword);
  }

  /**
   * Retrieve the filter roles from model search roles.
   * @param {string} searchKeyword
   * @returns {IFilterRole[]}
   */
  private getModelSearchFilterRoles(searchKeyword: string): IFilterRole[] {
    const model = this.getModel();
    const searchRoles = [...model.searchRoles, ...this.extraSearchRoles];

    return searchRoles.map((searchRole, index) => ({
      ...searchRole,
      value: searchKeyword,
      index: index + 1,
    }));
  }

  /**
   * Sets the response meta.
   */
  setResponseMeta() {
    this.responseMeta = {
      searchKeyword: this.searchKeyword,
    };
  }

  /**
   * Retrieves the response meta.
   * @returns {IDynamicFilterSearchResponseMeta}
   */
  public getResponseMeta(): IDynamicFilterSearchResponseMeta {
    return {
      searchKeyword: this.searchKeyword,
    };
  }
}
