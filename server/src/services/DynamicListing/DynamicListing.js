
import {
  DynamicFilter,
  DynamicFilterSortBy,
  DynamicFilterViews,
  DynamicFilterFilterRoles,
} from 'lib/DynamicFilter';
import {
  mapViewRolesToConditionals,
  mapFilterRolesToDynamicFilter,
} from 'lib/ViewRolesBuilder';

export const DYNAMIC_LISTING_ERRORS = {
  LOGIC_INVALID: 'VIEW.LOGIC.EXPRESSION.INVALID',
  RESOURCE_HAS_NO_FIELDS: 'RESOURCE.HAS.NO.GIVEN.FIELDS',
};

export default class DynamicListing {
  
  /**
   * Constructor method.
   * @param {DynamicListingBuilder} dynamicListingBuilder 
   * @return {DynamicListing|Error}
   */
  constructor(dynamicListingBuilder) {
    this.listingBuilder = dynamicListingBuilder;
    this.dynamicFilter = new DynamicFilter(this.listingBuilder.modelClass.tableName);
    return this.init();
  }

  /**
   * Initialize the dynamic listing.
   */
  init() {
    // Initialize the column sort by.
    if (this.listingBuilder.columnSortBy) {
      const sortByFilter = new DynamicFilterSortBy(
        filter.column_sort_by,
        filter.sort_order
      );
      this.dynamicFilter.setFilter(sortByFilter);
    }
    // Initialize the view filter roles.
    if (this.listingBuilder.view && this.listingBuilder.view.roles.length > 0) {
      const viewFilter = new DynamicFilterViews(
        mapViewRolesToConditionals(this.listingBuilder.view.roles),
        this.listingBuilder.view.rolesLogicExpression
      );
      if (!viewFilter.validateFilterRoles()) {
        return new Error(DYNAMIC_LISTING_ERRORS.LOGIC_INVALID);
      }
      this.dynamicFilter.setFilter(viewFilter);
    }
    // Initialize the dynamic filter roles.
    if (this.listingBuilder.filterRoles.length > 0) {
      const filterRoles = new DynamicFilterFilterRoles(
        mapFilterRolesToDynamicFilter(filter.filter_roles),
        accountsResource.fields
      );
      this.dynamicFilter.setFilter(filterRoles);

      if (filterRoles.validateFilterRoles().length > 0) {
        return new Error(DYNAMIC_LISTING_ERRORS.RESOURCE_HAS_NO_FIELDS);
      }
    }
    return this;
  }

  /**
   * Build query.
   */
  buildQuery(){
    return this.dynamicFilter.buildQuery();
  }
}