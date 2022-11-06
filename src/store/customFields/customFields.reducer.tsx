// @ts-nocheck
import {createReducer} from '@reduxjs/toolkit';
import t from '@/store/types';

const initialState = {
  custom_fields: {
    accounts: [{
      label_name: 'Label',
      predefined: true,
      data_type: 'text',
      help_text: '123sdasd',
      active: true,
    }]
  },
};

export default createReducer(initialState, {
  [t.CUSTOM_FIELDS_RESOURCE_SET]: (state, action) => {
    state.fields.custom_fields[action.resource_slug] = action.custom_field;
  }
});

export const getCustomFieldsByResource = (state, resourceSlug) => {
  return state.fields.custom_fields[resourceSlug];
}