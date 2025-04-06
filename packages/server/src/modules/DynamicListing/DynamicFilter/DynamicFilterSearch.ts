import { IFilterRole } from './DynamicFilter.types';
import { DynamicFilterFilterRoles } from './DynamicFilterFilterRoles';

export interface IDynamicFilterSearchResponseMeta {
  searchKeyword: string;
}

export class DynamicFilterSearch extends DynamicFilterFilterRoles {
  private searchKeyword: string;

  /**
   * Constructor method.
   * @param {string} searchKeyword - Search keyword.
   */
  constructor(searchKeyword: string) {
    super();
    this.searchKeyword = searchKeyword;
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

    return model.searchRoles.map((searchRole, index) => ({
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
