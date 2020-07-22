

export default class DynamicListingBuilder {

  addModelClass(modelClass) {
    this.modelClass = modelClass;
  }

  addCustomViewId(customViewId) {
    this.customViewId = customViewId;
  }

  addFilterRoles (filterRoles) {
    this.filterRoles = filterRoles;
  }

  addSortBy(sortBy, sortOrder) {
    this.sortBy = sortBy;
    this.sortOrder = sortOrder;
  }

  addView(view) {
    this.view = view;
  }
}