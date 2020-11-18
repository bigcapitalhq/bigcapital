import React from 'react';
import { FormGroup, InputGroup, ControlGroup } from '@blueprintjs/core';
import { FastField, ErrorMessage } from 'formik';
import { FormattedMessage as T } from 'react-intl';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import { inputIntent } from 'utils';


/**
 * Vendor form  after primary section.
 */
function VendorFormAfterPrimarySection() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      {/*------------ Vendor email -----------*/}
      <FastField name={'email'}>
        {({ field, meta: { error, touched } }) => (
          <FormGroup
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'email'} />}
            className={'form-group--email'}
            label={<T id={'vendor_email'} />}
            inline={true}
          >
            <InputGroup {...field} />
          </FormGroup>
        )}
      </FastField>
      {/*------------ Phone number -----------*/}
      <FormGroup
        className={'form-group--phone-number'}
        label={<T id={'phone_number'} />}
        inline={true}
      >
        <ControlGroup>
          <FastField name={'work_phone'}>
            {({ field, meta: { error, touched } }) => (
              <InputGroup
                intent={inputIntent({ error, touched })}
                placeholder={'Work'}
                {...field}
              />
            )}
          </FastField>
          <FastField name={'personal_phone'}>
            {({ field, meta: { error, touched } }) => (
              <InputGroup
                intent={inputIntent({ error, touched })}
                placeholder={'Mobile'}
                {...field}
              />
            )}
          </FastField>
        </ControlGroup>
      </FormGroup>
      {/*------------ Vendor website -----------*/}
      <FastField name={'website'}>
        {({ field, meta: { error, touched } }) => (
          <FormGroup
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'website'} />}
            className={'form-group--website'}
            label={<T id={'website'} />}
            inline={true}
          >
            <InputGroup {...field} />
          </FormGroup>
        )}
      </FastField>
    </div>
  );
}

export default VendorFormAfterPrimarySection;
