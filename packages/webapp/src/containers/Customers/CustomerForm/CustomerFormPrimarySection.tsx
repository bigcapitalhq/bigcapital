// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import { FormGroup, InputGroup, ControlGroup } from '@blueprintjs/core';
import { FastField, Field, ErrorMessage } from 'formik';
import {
  Hint,
  FieldRequiredHint,
  SalutationList,
  DisplayNameList,
  FormattedMessage as T,
  FInputGroup,
  FFormGroup,
} from '@/components';
import CustomerTypeRadioField from './CustomerTypeRadioField';
import { CLASSES } from '@/constants/classes';
import { inputIntent } from '@/utils';
import { useAutofocus } from '@/hooks';

/**
 * Customer form primary section.
 */
export default function CustomerFormPrimarySection({}) {
  const firstNameFieldRef = useAutofocus();

  return (
    <div className={'customer-form__primary-section-content'}>
      {/**-----------Customer type. -----------*/}
      <CustomerTypeRadioField />

      {/**----------- Contact name -----------*/}
      <FFormGroup
        name={'salutation'}
        label={<T id={'contact_name'} />}
        inline={true}
      >
        <ControlGroup>
          <SalutationList
            name={'salutation'}
            popoverProps={{ minimal: true }}
          />
          <FInputGroup
            name={'first_name'}
            placeholder={intl.get('first_name')}
            inputRef={(ref) => (firstNameFieldRef.current = ref)}
          />
          <FInputGroup name={'last_name'} placeholder={intl.get('last_name')} />
        </ControlGroup>
      </FFormGroup>

      {/*----------- Company Name -----------*/}
      <FFormGroup
        name={'company_name'}
        label={<T id={'company_name'} />}
        inline={true}
      >
        <InputGroup name={'company_name'} />
      </FFormGroup>

      {/*----------- Display Name -----------*/}
      <FFormGroup
        name={'display_name'}
        label={
          <>
            <T id={'display_name'} />
            <FieldRequiredHint />
            <Hint />
          </>
        }
        inline={true}
      >
        <DisplayNameList
          name={'display_name'}
          popoverProps={{ minimal: true }}
        />
      </FFormGroup>
    </div>
  );
}
