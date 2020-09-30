import React from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { InputGroup, FormGroup, Intent } from '@blueprintjs/core';
import ErrorMessage from 'components/ErrorMessage';

function LicenseTab({
  formik: { errors, touched, setFieldValue, getFieldProps },
}) {
  return (
    <div className={'license-container'}>
      <h4>
        <T id={'license_code'} />
      </h4>
      <p className={'bg-message'}>
        <T id={'cards_will_be_charged'} />
      </p>

      <FormGroup
        label={<T id={'license_number'} />}
        intent={errors.license_code && touched.license_code && Intent.DANGER}
        helperText={
          <ErrorMessage name="license_code" {...{ errors, touched }} />
        }
        className={'form-group-license_code'}
      >
        <InputGroup
          intent={errors.license_code && touched.license_code && Intent.DANGER}
          {...getFieldProps('license_code')}
        />
      </FormGroup>
    </div>
  );
}

export default LicenseTab;
