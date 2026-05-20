import { createReducer } from "@reduxjs/toolkit";
import { RESOURCE_COLUMNS_SET, RESOURCE_DATA_SET, RESOURCE_FIELDS_SET } from '@/store/types';;

interface ResourcesState {
  data: { resources: Record<string, unknown> };
  fields: Record<string, unknown>;
  columns: Record<string, unknown>;
  resourceFields: Record<string, unknown>;
  resourceColumns: Record<string, unknown>;
  metadata: Record<string, unknown>;
}

type ResourcesAction = {
  type: string;
  columns?: Array<Record<string, unknown>>;
  fields?: Array<Record<string, unknown>>;
  resource_slug?: string;
  payload?: { data: Array<Record<string, unknown>>; resourceKey: string };
};

const initialState: ResourcesState = {
  data: {
    resources: {},
  },
  fields: {},
  columns: {},
  resourceFields: {},
  resourceColumns: {},

  metadata: {
    'accounts': {
      label: 'Accounts',
      baseRoute: '/accounts',
    },
    'items': {
      label: 'Items',
      baseRoute: '/items',
    },
    'manual_journals': {
      label: 'Journals',
      baseRoute: '/manual-journals',
    }
  }
};

export const resourcesReducer = createReducer(initialState, {
  [RESOURCE_COLUMNS_SET]: (state, action: ResourcesAction) => {
    const _columns: Record<string, unknown> = {};

    (action.columns ?? []).forEach((column) => {
      _columns[column['id'] as string] = column;
    });
    state.columns = {
      ...state.columns,
      ..._columns,
    };
    if (action.resource_slug) {
      state.resourceColumns[action.resource_slug] = (action.columns ?? []).map((c) => c['id']);
    }
  },

  [RESOURCE_FIELDS_SET]: (state, action: ResourcesAction) => {
    const _fields: Record<string, unknown> = {};

    (action.fields ?? []).forEach((field) => {
      _fields[field['key'] as string] = field;
    });
    state.fields = {
      ...state.fields,
      ..._fields,
    };
    if (action.resource_slug) {
      state.resourceFields[action.resource_slug] = (action.fields ?? []).map((f) => f['key']);
    }
  },

  [RESOURCE_DATA_SET]: (state, action: ResourcesAction) => {
    const { data, resourceKey } = action.payload!;
    const _data: Record<string, unknown> = {};

    data.forEach((item) => {
      _data[item['id'] as string] = item;
    });
    const order = data.map((item) => item['id']);

    state.data.resources[resourceKey] = {
      ...(state.data.resources[resourceKey] as Record<string, unknown> || {}),
      data: _data,
      order,
    };
  },
});