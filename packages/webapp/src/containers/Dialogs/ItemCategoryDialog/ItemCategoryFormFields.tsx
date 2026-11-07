import { Classes } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import {
  FieldRequiredHint,
  FFormGroup,
  FInputGroup,
  FSelect,
  FTextArea,
} from '@/components';
import { useAutofocus } from '@/hooks';

export function ItemCategoryFormFields(): React.ReactElement {
  const categoryNameFieldRef = useAutofocus<HTMLInputElement>();

  const costMethodOptions = React.useMemo(
    () => [
      { value: 'AVG', label: intl.get('cost_method_average') },
      { value: 'FIFO', label: intl.get('cost_method_fifo') },
      { value: 'LIFO', label: intl.get('cost_method_lifo') },
    ],
    [],
  );

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

      <FFormGroup
        name={'costMethod'}
        label={intl.get('cost_method')}
        helperText={intl.get('cost_method_change_hint')}
        inline
        fastField
      >
        <FSelect
          name={'costMethod'}
          items={costMethodOptions}
          valueAccessor={'value'}
          textAccessor={'label'}
          filterable={false}
          popoverProps={{ minimal: true }}
          buttonProps={{ 'data-testId': 'category-cost-method-select' }}
          fastField
        />
      </FFormGroup>
    </div>
  );
}
