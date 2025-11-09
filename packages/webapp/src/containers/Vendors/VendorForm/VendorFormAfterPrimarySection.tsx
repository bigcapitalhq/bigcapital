// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { ControlGroup } from '@blueprintjs/core';
import { FormattedMessage as T, FFormGroup, FInputGroup } from '@/components';

/**
 * Vendor form  after primary section.
 */
function VendorFormAfterPrimarySection() {
  return (
    <div className={'customer-form__after-primary-section-content'}>
      {/*------------ Vendor email -----------*/}
      <FFormGroup
        name={'email'}
        label={<T id={'vendor_email'} />}
        inline={true}
      >
        <FInputGroup name={'email'} />
      </FFormGroup>

      {/*------------ Phone number -----------*/}
      <FFormGroup
        name={'work_phone'}
        className={'form-group--phone-number'}
        label={<T id={'phone_number'} />}
        inline={true}
      >
        <ControlGroup>
          <FInputGroup name={'work_phone'} placeholder={intl.get('work')} />
          <FInputGroup
            name={'personal_phone'}
            placeholder={intl.get('mobile')}
          />
        </ControlGroup>
      </FFormGroup>

      {/*------------ Vendor website -----------*/}
      <FFormGroup name={'website'} label={<T id={'website'} />} inline={true}>
        <FInputGroup name={'website'} placeholder={'http://'} />
      </FFormGroup>
    </div>
  );
}

export default VendorFormAfterPrimarySection;
