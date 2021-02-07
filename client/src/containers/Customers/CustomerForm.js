import React, { useMemo, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import moment from 'moment';
import { Intent } from '@blueprintjs/core';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';

import { CLASSES } from 'common/classes';
import AppToaster from 'components/AppToaster';

import CustomerFormPrimarySection from './CustomerFormPrimarySection';
import CustomerFormAfterPrimarySection from './CustomerFormAfterPrimarySection';
import CustomersTabs from 'containers/Customers/CustomersTabs';
import CustomerFloatingActions from './CustomerFloatingActions';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withSettings from 'containers/Settings/withSettings';

import { compose, transformToForm } from 'utils';
import { useCustomerFormContext } from './CustomerFormProvider';

const defaultInitialValues = {
  customer_type: 'business',
  salutation: '',
  first_name: '',
  last_name: '',
  company_name: '',
  display_name: '',

  email: '',
  work_phone: '',
  personal_phone: '',
  website: '',
  note: '',
  active: true,

  billing_address_country: '',
  billing_address_1: '',
  billing_address_2: '',
  billing_address_city: '',
  billing_address_state: '',
  billing_address_postcode: '',
  billing_address_phone: '',

  shipping_address_country: '',
  shipping_address_1: '',
  shipping_address_2: '',
  shipping_address_city: '',
  shipping_address_state: '',
  shipping_address_postcode: '',
  shipping_address_phone: '',

  opening_balance: '',
  currency_code: '',
  opening_balance_at: moment(new Date()).format('YYYY-MM-DD'),
};

/**
 * Customer form.
 */
function CustomerForm({
  // #withDashboardActions
  changePageTitle,

  // #withSettings
  baseCurrency,
}) {
  const {
    customer,
    customerId,
    submitPayload,
    editCustomerMutate,
    createCustomerMutate,
  } = useCustomerFormContext();

  const isNewMode = !customerId;
  const history = useHistory();
  const { formatMessage } = useIntl();

  const validationSchema = Yup.object().shape({
    customer_type: Yup.string()
      .required()
      .trim()
      .label(formatMessage({ id: 'customer_type_' })),
    salutation: Yup.string().trim(),
    first_name: Yup.string().trim(),
    last_name: Yup.string().trim(),
    company_name: Yup.string().trim(),
    display_name: Yup.string()
      .trim()
      .required()
      .label(formatMessage({ id: 'display_name_' })),

    email: Yup.string().email().nullable(),
    work_phone: Yup.number(),
    personal_phone: Yup.number(),
    website: Yup.string().url().nullable(),

    active: Yup.boolean(),
    note: Yup.string().trim(),

    billing_address_country: Yup.string().trim(),
    billing_address_1: Yup.string().trim(),
    billing_address_2: Yup.string().trim(),
    billing_address_city: Yup.string().trim(),
    billing_address_state: Yup.string().trim(),
    billing_address_postcode: Yup.number().nullable(),
    billing_address_phone: Yup.number(),

    shipping_address_country: Yup.string().trim(),
    shipping_address_1: Yup.string().trim(),
    shipping_address_2: Yup.string().trim(),
    shipping_address_city: Yup.string().trim(),
    shipping_address_state: Yup.string().trim(),
    shipping_address_postcode: Yup.number().nullable(),
    shipping_address_phone: Yup.number(),

    opening_balance: Yup.number().nullable(),
    currency_code: Yup.string(),
    opening_balance_at: Yup.date(),
  });

  /**
   * Initial values in create and edit mode.
   */
  const initialValues = useMemo(
    () => ({
      ...defaultInitialValues,
      currency_code: baseCurrency,
      ...transformToForm(customer, defaultInitialValues),
    }),
    [customer, baseCurrency],
  );

  useEffect(() => {
    !isNewMode
      ? changePageTitle(formatMessage({ id: 'edit_customer' }))
      : changePageTitle(formatMessage({ id: 'new_customer' }));
  }, [changePageTitle, isNewMode, formatMessage]);

  //Handles the form submit.
  const handleFormSubmit = (
    values,
    { setSubmitting, resetForm, setErrors },
  ) => {
    const formValues = { ...values };

    const onSuccess = () => {
      AppToaster.show({
        message: formatMessage({
          id: customer
            ? 'the_item_customer_has_been_edited_successfully'
            : 'the_customer_has_been_created_successfully',
        }),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);
      resetForm();

      if (!submitPayload.noRedirect) {
        history.push('/customers');
      }
    };

    const onError = () => {
      setSubmitting(false);
    };

    if (customer && customer.id) {
      editCustomerMutate(customer.id, formValues)
        .then(onSuccess)
        .catch(onError);
    } else {
      createCustomerMutate(formValues).then(onSuccess).catch(onError);
    }
  };

  return (
    <div className={classNames(CLASSES.PAGE_FORM, CLASSES.PAGE_FORM_CUSTOMER)}>
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
      >
        <Form>
          <div className={classNames(CLASSES.PAGE_FORM_HEADER_PRIMARY)}>
            <CustomerFormPrimarySection />
          </div>

          <div className={'page-form__after-priamry-section'}>
            <CustomerFormAfterPrimarySection />
          </div>

          <div className={classNames(CLASSES.PAGE_FORM_TABS)}>
            <CustomersTabs />
          </div>

          <CustomerFloatingActions />
        </Form>
      </Formik>
    </div>
  );
}

export default compose(
  withSettings(({ organizationSettings }) => ({
    baseCurrency: organizationSettings?.baseCurrency,
  })),
  withDashboardActions,
)(CustomerForm);
