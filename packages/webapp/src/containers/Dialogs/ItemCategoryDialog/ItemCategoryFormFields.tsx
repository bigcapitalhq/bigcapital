// @ts-nocheck
import React from 'react';
import { Classes } from '@blueprintjs/core';
import {
  FormattedMessage as T,
  FieldRequiredHint,
  FFormGroup,
  FInputGroup,
  FTextArea,
} from '@/components';

import { useAutofocus } from '@/hooks';

/**
 * Item category form fields.
 */
export default function ItemCategoryFormFields() {
  const categoryNameFieldRef = useAutofocus();

  return (
    <div className={Classes.DIALOG_BODY}>
      {/* ----------- Category name ----------- */}
      <FFormGroup
        name={'name'}
        label={<T id={'category_name'} />}
        labelInfo={<FieldRequiredHint />}
        inline
        fastField
      >
        <FInputGroup
          name={'name'}
          medium={true}
          inputRef={(ref) => (categoryNameFieldRef.current = ref)}
          fastField
        />
      </FFormGroup>

      {/* ----------- Description ----------- */}
      <FFormGroup
        name={'description'}
        label={<T id={'description'} />}
        inline
        fastField
      >
        <FTextArea
          name={'description'}
          growVertically={true}
          large={true}
          fastField
        />
      </FFormGroup>
    </div>
  );
}
