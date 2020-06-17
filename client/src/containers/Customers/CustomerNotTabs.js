import React from 'react';
import {
  Button,
  Classes,
  FormGroup,
  InputGroup,
  Intent,
  TextArea,
  MenuItem,
} from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import ErrorMessage from 'components/ErrorMessage';

const CustomerBillingAddress = ({
  formik: { errors, touched, setFieldValue, getFieldProps },
}) => {
  return (
    <div>
      <FormGroup
        label={<T id={'note'} />}
        // className={'form-group--description'}
        intent={errors.note && touched.note && Intent.DANGER}
        helperText={<ErrorMessage name="note" {...{ errors, touched }} />}
        inline={true}
      >
        <TextArea
          growVertically={true}
          large={true}
          {...getFieldProps('note')}
        />
      </FormGroup>
    </div>
  );
};

export default CustomerBillingAddress;
