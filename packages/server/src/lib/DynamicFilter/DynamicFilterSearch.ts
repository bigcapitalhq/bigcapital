import { IFilterRole } from '@/interfaces';
import DynamicFilterFilterRoles from './DynamicFilterFilterRoles';

export default class DynamicFilterSearch extends DynamicFilterFilterRoles {
  private searchKeyword: string;
  private filterRoles: IFilterRole[];

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
   * 
   */
  setResponseMeta() {
    this.responseMeta = {
      searchKeyword: this.searchKeyword,
    };
  }
}
