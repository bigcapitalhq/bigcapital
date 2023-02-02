// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import { FormGroup, InputGroup, ControlGroup } from '@blueprintjs/core';
import { FastField, Field, ErrorMessage } from 'formik';
import { FormattedMessage as T } from '@/components';
import { CLASSES } from '@/constants/classes';
import { inputIntent } from '@/utils';
import { useAutofocus } from '@/hooks';
import {
  Hint,
  FieldRequiredHint,
  SalutationList,
  DisplayNameList,
} from '@/components';

/**
 * Vendor form primary section.
 */
function VendorFormPrimarySection() {
  const firstNameFieldRef = useAutofocus();

  return (
    <div className={'customer-form__primary-section-content'}>
      {/**----------- Vendor name -----------*/}
      <FormGroup
        className={classNames('form-group--contact_name')}
        label={<T id={'contact_name'} />}
        inline={true}
      >
        <ControlGroup>
          <FastField name={'salutation'}>
            {({ form, field: { value }, meta: { error, touched } }) => (
              <SalutationList
                onItemSelect={(salutation) => {
                  form.setFieldValue('salutation', salutation.label);
                }}
                selectedItem={value}
                popoverProps={{ minimal: true }}
                className={classNames(
                  CLASSES.FORM_GROUP_LIST_SELECT,
                  CLASSES.FILL,
                  'input-group--salutation-list',
                  'select-list--fill-button',
                )}
              />
            )}
          </FastField>

          <FastField name={'first_name'}>
            {({ field, meta: { error, touched } }) => (
              <InputGroup
                placeholder={intl.get('first_name')}
                intent={inputIntent({ error, touched })}
                className={classNames('input-group--first-name')}
                inputRef={(ref) => (firstNameFieldRef.current = ref)}
                {...field}
              />
            )}
          </FastField>

          <FastField name={'last_name'}>
            {({ field, meta: { error, touched } }) => (
              <InputGroup
                placeholder={intl.get('last_name')}
                intent={inputIntent({ error, touched })}
                className={classNames('input-group--last-name')}
                {...field}
              />
            )}
          </FastField>
        </ControlGroup>
      </FormGroup>

      {/*----------- Company Name -----------*/}
      <FastField name={'company_name'}>
        {({ field, meta: { error, touched } }) => (
          <FormGroup
            className={classNames('form-group--company_name')}
            label={<T id={'company_name'} />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'company_name'} />}
            inline={true}
          >
            <InputGroup {...field} />
          </FormGroup>
        )}
      </FastField>
      {/*----------- Display Name -----------*/}
      <Field name={'display_name'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            helperText={<ErrorMessage name={'display_name'} />}
            intent={inputIntent({ error, touched })}
            label={
              <>
                <T id={'display_name'} />
                <FieldRequiredHint />
                <Hint />
              </>
            }
            className={classNames(CLASSES.FORM_GROUP_LIST_SELECT, CLASSES.FILL)}
            inline={true}
          >
            <DisplayNameList
              firstName={form.values.first_name}
              lastName={form.values.last_name}
              company={form.values.company_name}
              salutation={form.values.salutation}
              onItemSelect={(displayName) => {
                form.setFieldValue('display_name', displayName.label);
              }}
              selectedItem={value}
              popoverProps={{ minimal: true }}
            />
          </FormGroup>
        )}
      </Field>
    </div>
  );
}

export default VendorFormPrimarySection;
