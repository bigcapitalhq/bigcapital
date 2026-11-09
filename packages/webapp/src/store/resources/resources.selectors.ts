import { createSelector } from 'reselect';
import type { RootState } from '@/store/reducers';
import { pickItemsFromIds } from '@/store/selectors';

const resourceDataIdsSelector = (
  state: RootState,
  props: { resourceName: string },
) => {
  return (
    state.resources.data.resources[props.resourceName] as
      | Record<string, unknown>
      | undefined
  )?.['order'] as Array<string | number> | undefined;
};
const resourceDataSelector = (
  state: RootState,
  props: { resourceName: string },
) => {
  return (
    state.resources.data.resources[props.resourceName] as
      | Record<string, unknown>
      | undefined
  )?.['data'] as Record<string, unknown> | undefined;
};

const resourceFieldsIdsSelector = (
  state: RootState,
  props: { resourceName: string },
) =>
  state.resources.resourceFields[props.resourceName] as
    | Array<string>
    | undefined;
const resourceFieldsItemsSelector = (state: RootState) =>
  state.resources.fields;

export const getResourceFieldsFactory = () =>
  createSelector(
    resourceFieldsIdsSelector,
    resourceFieldsItemsSelector,
    (fieldsIds, fieldsItems) =>
      pickItemsFromIds(
        fieldsItems,
        (fieldsIds ?? []) as Array<string | number>,
      ),
  );

export const getResourceDataFactory = () =>
  createSelector(
    resourceDataSelector,
    resourceDataIdsSelector,
    (resourceData, resourceDataIds) =>
      pickItemsFromIds(
        resourceData ?? {},
        (resourceDataIds ?? []) as Array<string | number>,
      ),
  );

export const getResourceColumns = (state: RootState, resourceSlug: string) => {
  const resourceIds = state.resources.resourceColumns[resourceSlug] as
    | Array<string | number>
    | undefined;
  return pickItemsFromIds(state.resources.columns, resourceIds ?? []);
};

export const getResourceField = (state: RootState, fieldId: string | number) =>
  state.resources.fields[fieldId as string];

export const getResourceColumn = (
  state: RootState,
  columnId: string | number,
) => state.resources.columns[columnId as string];

export const getResourceMetadata = (state: RootState, resourceSlug: string) =>
  state.resources.metadata[resourceSlug];

export const getResourceData = (state: RootState, resourceSlug: string) =>
  (state.resources.data as Record<string, unknown>)[resourceSlug] || {};
