import { Classes } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import type { ItemCategoryFormValues } from './types';
import {
  FieldRequiredHint,
  FFormGroup,
  FInputGroup,
  FSelect,
  FTextArea,
} from '@/components';
import {
  getItemCostMethodLabel,
  ITEM_COST_METHOD_INHERIT,
} from '@/constants/costMethods';
import { useAutofocus } from '@/hooks';
import { useSettingsItems } from '@/hooks/query';

export function ItemCategoryFormFields(): React.ReactElement {
  const categoryNameFieldRef = useAutofocus<HTMLInputElement>();
  const { values } = useFormikContext<ItemCategoryFormValues>();
  const { data: itemsSettings } = useSettingsItems();
  const defaultCostMethod =
    (itemsSettings?.defaultCostMethod as string | undefined) || 'AVG';

  const costMethodOptions = React.useMemo(
    () => [
      {
        value: ITEM_COST_METHOD_INHERIT,
        label: intl.get('cost_method_inherit_from_preferences'),
      },
      { value: 'AVG', label: intl.get('cost_method_average') },
      { value: 'FIFO', label: intl.get('cost_method_fifo') },
      { value: 'LIFO', label: intl.get('cost_method_lifo') },
    ],
    [],
  );

  const costMethodHelperText = values.costMethod
    ? intl.get('cost_method_category_hint')
    : intl.get('cost_method_inherit_hint', {
        method: getItemCostMethodLabel(defaultCostMethod),
      });

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
        helperText={costMethodHelperText}
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
