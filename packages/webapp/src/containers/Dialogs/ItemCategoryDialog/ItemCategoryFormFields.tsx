import { Classes } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import {
  FieldRequiredHint,
  FFormGroup,
  FInputGroup,
  FTextArea,
} from '@/components';
import { useAutofocus } from '@/hooks';

export function ItemCategoryFormFields(): React.ReactElement {
  const categoryNameFieldRef = useAutofocus<HTMLInputElement>();

  return (
    <div className={Classes.DIALOG_BODY}>
      <FFormGroup
        name={'name'}
        label={intl.get('category_name')}
        labelInfo={<FieldRequiredHint />}
        inline
        fastField
      >
        <FInputGroup
          name={'name'}
          inputRef={(ref: HTMLInputElement | null) => {
            categoryNameFieldRef.current = ref;
          }}
          data-testId={'category-name-input'}
          fastField
        />
      </FFormGroup>

      <FFormGroup
        name={'description'}
        label={intl.get('description')}
        inline
        fastField
      >
        <FTextArea
          name={'description'}
          growVertically={true}
          large={true}
          data-testId={'category-description-input'}
          fastField
        />
      </FFormGroup>
    </div>
  );
}
