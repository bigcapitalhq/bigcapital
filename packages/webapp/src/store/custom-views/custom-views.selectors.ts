import { createSelector } from 'reselect';
import type { RootState } from '@/store/reducers';
import { pickItemsFromIds } from '@/store/selectors';

const resourceViewsIdsSelector = (
  state: RootState,
  _props: unknown,
  resourceName: string,
) =>
  state.views.resourceViews[resourceName] as Array<string | number> | undefined;

const viewsSelector = (state: RootState) =>
  state.views.views as Record<string, unknown>;

const viewByIdSelector = (
  state: RootState,
  props: { viewId: string | number },
) => state.views.views[props.viewId as string];

export const getResourceViews = createSelector(
  resourceViewsIdsSelector,
  viewsSelector,
  (resourceViewsIds, views) => {
    return resourceViewsIds ? pickItemsFromIds(views, resourceViewsIds) : [];
  },
);

export const getViewMetaFactory = () =>
  createSelector(viewByIdSelector, (view) => view);

export const getViewItemFactory = () =>
  createSelector(viewByIdSelector, (view) => view);

export const getViewPages = (
  resourceViews: Record<string, { pages?: unknown }>,
  viewId: string | number,
) => {
  return typeof resourceViews[viewId] === 'undefined'
    ? {}
    : resourceViews[viewId].pages;
};
