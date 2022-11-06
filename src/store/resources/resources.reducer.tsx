// @ts-nocheck
import { createReducer } from "@reduxjs/toolkit";
import t from '@/store/types';

const initialState = {
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

export default createReducer(initialState, {
  [t.RESOURCE_COLUMNS_SET]: (state, action) => {
    const _columns = {};
    
    action.columns.forEach((column) => {
      _columns[column.id] = column;
    });
    state.columns = {
      ...state.columns,
      ..._columns,
    };
    state.resourceColumns[action.resource_slug] = action.columns.map(c => c.id);
  },

  [t.RESOURCE_FIELDS_SET]: (state, action) => {
    const _fields = {};

    action.fields.forEach((field) => {
      _fields[field.key] = field;
    });
    state.fields = {
      ...state.fields,
      ..._fields,
    };
    state.resourceFields[action.resource_slug] = action.fields.map(f => f.key);
  },

  [t.RESOURCE_DATA_SET]: (state, action) => {
    const { data, resourceKey } = action.payload;
    const _data = {};

    data.forEach((item) => {
      _data[item.id] = item;
    });
    const order = data.map((item) => item.id);

    state.data.resources[resourceKey] = {
      ...(state.data.resources[resourceKey] || {}),
      data: _data,
      order,
    };
  },
});