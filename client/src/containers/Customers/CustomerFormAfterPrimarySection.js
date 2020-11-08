import React from 'react';
import {
  FormGroup,
  Intent,
  InputGroup,
  ControlGroup,
} from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import { ErrorMessage } from 'components';

export default function CustomerFormAfterPrimarySection({
  setFieldValue,
  getFieldProps,
  errors,
  values,
  touched,
}) {
  return (
    <div class="customer-form__after-primary-section-content">
      {/*------------ Customer email -----------*/}
      <FormGroup
        intent={errors.email && touched.email && Intent.DANGER}
        helperText={<ErrorMessage name={'email'} {...{ errors, touched }} />}
        className={'form-group--email'}
        label={<T id={'customer_email'} />}
        inline={true}
      >
        <InputGroup
          intent={errors.email && touched.email && Intent.DANGER}
          {...getFieldProps('email')}
        />
      </FormGroup>

      {/*------------ Customer email -----------*/}
      <FormGroup
        intent={errors.work_phone && touched.work_phone && Intent.DANGER}
        helperText={
          <ErrorMessage name={'work_phone'} {...{ errors, touched }} />
        }
        className={'form-group--phone-number'}
        label={<T id={'phone_number'} />}
        inline={true}
      >
        <ControlGroup>
          <InputGroup
            intent={errors.work_phone && touched.work_phone && Intent.DANGER}
            {...getFieldProps('work_phone')}
            placeholder={'Work'}
          />

          <InputGroup
            intent={errors.work_phone && touched.work_phone && Intent.DANGER}
            {...getFieldProps('work_phone')}
            placeholder={'Mobile'}
          />
        </ControlGroup>
      </FormGroup>

      {/*------------ Customer website -----------*/}
      <FormGroup
        intent={errors.website && touched.website && Intent.DANGER}
        helperText={<ErrorMessage name={'website'} {...{ errors, touched }} />}
        className={'form-group--website'}
        label={<T id={'website'} />}
        inline={true}
      >
        <InputGroup
          intent={errors.website && touched.website && Intent.DANGER}
          {...getFieldProps('website')}
        />
      </FormGroup>
    </div>
  );
}
