import { createReducer } from '@reduxjs/toolkit';
import type {
  CustomFieldsState,
  CustomFieldsAction,
} from './custom-fields.types';
import { CUSTOM_FIELDS_RESOURCE_SET } from '@/store/types';

const initialState: CustomFieldsState = {
  custom_fields: {
    accounts: [
      {
        label_name: 'Label',
        predefined: true,
        data_type: 'text',
        help_text: '123sdasd',
        active: true,
      },
    ],
  },
};

export const customFieldsReducer = createReducer(initialState, {
  [CUSTOM_FIELDS_RESOURCE_SET]: (state, action: CustomFieldsAction) => {
    if (action.resource_slug !== undefined) {
      state.custom_fields[action.resource_slug] = action.custom_field;
    }
  },
});

export const getCustomFieldsByResource = (
  state: { fields: CustomFieldsState },
  resourceSlug: string,
) => {
  return state.fields.custom_fields[resourceSlug];
};
