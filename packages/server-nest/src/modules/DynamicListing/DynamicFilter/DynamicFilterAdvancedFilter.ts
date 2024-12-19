import { IFilterRole } from './DynamicFilter.types';
import { DynamicFilterFilterRoles } from './DynamicFilterFilterRoles';

export class DynamicFilterAdvancedFilter extends DynamicFilterFilterRoles {
  private filterRoles: IFilterRole[];

  /**
   * Constructor method.
   * @param {Array} filterRoles -
   * @param {Array} resourceFields -
   */
  constructor(filterRoles: IFilterRole[]) {
    super();

    this.filterRoles = filterRoles;
    this.setResponseMeta();
  }

  /**
   * Sets response meta.
   */
  private setResponseMeta() {
    this.responseMeta = {
      filterRoles: this.filterRoles,
    };
  }
}
