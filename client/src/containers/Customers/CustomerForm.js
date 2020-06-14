import React, { useState, useMemo, useCallback, useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  FormGroup,
  MenuItem,
  Intent,
  InputGroup,
  Button,
  Classes,
  Checkbox,
  RadioGroup,
  Radio,
} from '@blueprintjs/core';
import { Row, Col } from 'react-grid-system';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { queryCache, useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';
import { pick } from 'lodash';
import classNames from 'classnames';

import AppToaster from 'components/AppToaster';
import ErrorMessage from 'components/ErrorMessage';
import Icon from 'components/Icon';
import MoneyInputGroup from 'components/MoneyInputGroup';
import Dragzone from 'components/Dragzone';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withCustomerDetail from './withCustomerDetail';
import withCustomersActions from './withCustomersActions';
import RadioCustomer from './RadioCustomer';

import { compose, handleStringChange } from 'utils';
import withCustomers from './withCustomers';

function CustomerForm({
  // #withDashboardActions
  changePageTitle,

  customers,
  //#withCustomersActions
  requestSubmitCustomer,
  requestFetchCustomers,
}) {
  const { formatMessage } = useIntl();

  const validationSchema = Yup.object().shape({
    customer_type: Yup.string()
      .required()
      .trim()
      .label(formatMessage({ id: 'customer_type_' })),
    first_name: Yup.string().trim(),
    last_name: Yup.string().trim(),
    company_name: Yup.string().trim(),
    display_name: Yup.string()
      .trim()
      .required()
      .label(formatMessage({ id: 'display_name_' })),
    email: Yup.string().email(),
    work_phone: Yup.string(),
  });

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'new_customer' }));
  }, [changePageTitle, formatMessage]);
  //business
  const initialValues = useMemo(
    () => ({
      customer_type: 'business',
      first_name: '',
      last_name: '',
      company_name: '',
      display_name: '',
      // email: '',
      work_phone: '',
    }),
    [],
  );
  const {
    getFieldProps,
    setFieldValue,
    values,
    touched,
    errors,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    enableReinitialize: true,
    validationSchema: validationSchema,
    initialValues: {
      ...initialValues,
    },

    onSubmit: (values, { setSubmitting, resetForm, setErrors }) => {
      requestSubmitCustomer(values)
        .then((response) => {
          AppToaster.show({
            message: formatMessage({
              id: 'the_customer_has_been_successfully_created',
            }),
            intent: Intent.SUCCESS,
          });
        })
        .catch((errors) => {
          setSubmitting(false);
        });
    },
  });

  const requiredSpan = useMemo(() => <span class="required">*</span>, []);
  const handleCustomerTypeCahange = useCallback(
    (value) => {
      setFieldValue('customer_type', value);
    },
    [setFieldValue],
  );

  console.log(customers, 'ER');

  const fetch = useQuery('customers-table', (key) => requestFetchCustomers());

  return (
    <div className={'customer-form'}>
      <form onSubmit={handleSubmit}>
        <div className={'customer-form__primary-section'}>
          <RadioCustomer
            selectedValue={values.customer_type}
            onChange={handleCustomerTypeCahange}
          />
          <FormGroup
            label={<T id={'display_name'} />}
            className={'form-group--name'}
            intent={
              errors.display_name && touched.display_name && Intent.DANGER
            }
            inline={true}
            helperText={
              <ErrorMessage {...{ errors, touched }} name={'display_name'} />
            }
          >
            <InputGroup
              intent={
                errors.display_name && touched.display_name && Intent.DANGER
              }
              {...getFieldProps('display_name')}
            />
          </FormGroup>
        </div>

        <div class="form__floating-footer">
          <Button intent={Intent.PRIMARY} disabled={isSubmitting} type="submit">
            <T id={'save'} />
          </Button>

          <Button className={'ml1'} disabled={isSubmitting}>
            <T id={'save_as_draft'} />
          </Button>

          <Button className={'ml1'}>
            <T id={'close'} />
          </Button>
        </div>
      </form>
    </div>
  );
}

export default compose(
  withCustomerDetail,
  withCustomers(({ customers }) => ({
    customers,
  })),
  withDashboardActions,
  withCustomersActions,
)(CustomerForm);
