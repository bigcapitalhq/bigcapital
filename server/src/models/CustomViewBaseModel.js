export default (Model) =>
  class CustomViewBaseModel extends Model {
    /**
     * Retrieve the default custom views, roles and columns.
     */
    static get defaultViews() {
      return [];
    }

    /**
     * Retrieve the default view by the given slug.
     */
    static getDefaultViewBySlug(viewSlug) {
      return this.defaultViews.find((view) => view.slug === viewSlug) || null;
    }

    static getDefaultViews() {
      return this.defaultViews;
    }
  };
