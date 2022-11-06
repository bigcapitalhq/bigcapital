// @ts-nocheck
import React from 'react';
import { Classes, FormGroup, InputGroup, TextArea } from '@blueprintjs/core';
import { FormattedMessage as T, FieldRequiredHint } from '@/components';
import { ErrorMessage, FastField } from 'formik';

import { useAutofocus } from '@/hooks';
import { inputIntent } from '@/utils';

/**
 * Item category form fields.
 */
export default function ItemCategoryFormFields() {
  const categoryNameFieldRef = useAutofocus();

  return (
    <div className={Classes.DIALOG_BODY}>
      {/* ----------- Category name ----------- */}
      <FastField name={'name'}>
        {({ field, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'category_name'} />}
            labelInfo={<FieldRequiredHint />}
            className={'form-group--category-name'}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="name" />}
            inline={true}
          >
            <InputGroup
              medium={true}
              inputRef={(ref) => (categoryNameFieldRef.current = ref)}
              intent={inputIntent({ error, touched })}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ----------- Description ----------- */}
      <FastField name={'description'}>
        {({ field, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'description'} />}
            className={'form-group--description'}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="description" />}
            inline={true}
          >
            <TextArea
              growVertically={true}
              large={true}
              intent={inputIntent({ error, touched })}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>
    </div>
  );
}
