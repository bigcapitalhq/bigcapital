import { BaseModel } from '@/models/Model';
import { IView } from '../Views/Views.types';

type GConstructor<T = {}> = new (...args: any[]) => T;

export interface ICustomViewBaseModel {
  defaultViews: IView[];
  getDefaultViewBySlug(viewSlug: string): IView | null;
  getDefaultViews(): IView[];
}

export const CustomViewBaseModelMixin = <T extends GConstructor<BaseModel>>(
  Model: T,
) =>
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

    /**
     * Retrieve the default views.
     * @returns {IView[]}
     */
    static getDefaultViews() {
      return this.defaultViews;
    }
  };
