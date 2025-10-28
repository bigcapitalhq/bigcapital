import { BaseModel } from '@/models/Model';

export const CustomViewBaseModel = (Model: typeof BaseModel) =>
  class extends Model {
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

    /**
     * Retrieve the default views.
     * @returns {IView[]}
     */
    static getDefaultViews() {
      return this.defaultViews;
    }
  };
