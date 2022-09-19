// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { FormGroup, InputGroup, ControlGroup } from '@blueprintjs/core';
import { FastField, ErrorMessage } from 'formik';
import { FormattedMessage as T } from '@/components';
import { inputIntent } from '@/utils';

export default function CustomerFormAfterPrimarySection({}) {
  return (
    <div class="customer-form__after-primary-section-content">
      {/*------------ Customer email -----------*/}
      <FastField name={'email'}>
        {({ field, meta: { error, touched } }) => (
          <FormGroup
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'email'} />}
            className={'form-group--email'}
            label={<T id={'customer_email'} />}
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
          <FastField name={'personal_phone'}>
            {({ field, meta: { error, touched } }) => (
              <InputGroup
                intent={inputIntent({ error, touched })}
                placeholder={intl.get('personal')}
                {...field}
              />
            )}
          </FastField>

          <FastField name={'work_phone'}>
            {({ field, meta: { error, touched } }) => (
              <InputGroup
                intent={inputIntent({ error, touched })}
                placeholder={intl.get('work')}
                {...field}
              />
            )}
          </FastField>
        </ControlGroup>
      </FormGroup>

      {/*------------ Customer website -----------*/}
      <FastField name={'website'}>
        {({ field, meta: { error, touched } }) => (
          <FormGroup
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'website'} />}
            className={'form-group--website'}
            label={<T id={'website'} />}
            inline={true}
          >
            <InputGroup placeholder={'http://'} {...field} />
          </FormGroup>
        )}
      </FastField>
    </div>
  );
}
