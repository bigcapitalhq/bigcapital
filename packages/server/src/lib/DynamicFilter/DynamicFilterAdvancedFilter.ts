import { IFilterRole } from '@/interfaces';
import DynamicFilterFilterRoles from './DynamicFilterFilterRoles';

export default class DynamicFilterAdvancedFilter extends DynamicFilterFilterRoles {
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
