// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import { ControlGroup } from '@blueprintjs/core';
import {
  FormattedMessage as T,
  FFormGroup,
  FInputGroup,
  Hint,
  FieldRequiredHint,
  SalutationList,
  DisplayNameList,
} from '@/components';
import { CLASSES } from '@/constants/classes';
import { useAutofocus } from '@/hooks';

/**
 * Vendor form primary section.
 */
function VendorFormPrimarySection() {
  const firstNameFieldRef = useAutofocus();

  return (
    <div className={'customer-form__primary-section-content'}>
      {/**----------- Vendor name -----------*/}
      <FFormGroup
        name={'salutation'}
        className={classNames('form-group--contact_name')}
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
            className={classNames('input-group--first-name')}
            inputRef={(ref) => (firstNameFieldRef.current = ref)}
          />
          <FInputGroup
            name={'last_name'}
            placeholder={intl.get('last_name')}
            className={classNames('input-group--last-name')}
          />
        </ControlGroup>
      </FFormGroup>

      {/*----------- Company Name -----------*/}
      <FFormGroup
        name={'company_name'}
        className={classNames('form-group--company_name')}
        label={<T id={'company_name'} />}
        inline={true}
      >
        <FInputGroup name={'company_name'} />
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
        fastField
        inline
      >
        <DisplayNameList
          name={'display_name'}
          popoverProps={{ minimal: true }}
        />
      </FFormGroup>
    </div>
  );
}

export default VendorFormPrimarySection;
