import React, { useMemo } from 'react';
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
import CustomersTabs from './CustomersTabs';
import CustomerFloatingActions from './CustomerFloatingActions';

import withSettings from 'containers/Settings/withSettings';

import { compose, transformToForm } from 'utils';
import { useCustomerFormContext } from './CustomerFormProvider';
import { CreateCustomerForm, EditCustomerForm } from './CustomerForm.schema';

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
  // #withSettings
  baseCurrency,
}) {
  const {
    customer,
    customerId,
    submitPayload,
    contactDuplicate,
    editCustomerMutate,
    createCustomerMutate,
    isNewMode,
  } = useCustomerFormContext();

  // const isNewMode = !customerId;
  const history = useHistory();
  const { formatMessage } = useIntl();

  /**
   * Initial values in create and edit mode.
   */
  const initialValues = useMemo(
    () => ({
      ...defaultInitialValues,
      currency_code: baseCurrency,
      ...transformToForm(customer || contactDuplicate, defaultInitialValues),
    }),
    [customer, contactDuplicate, baseCurrency],
  );

  //Handles the form submit.
  const handleFormSubmit = (
    values,
    { setSubmitting, resetForm, setErrors },
  ) => {
    const formValues = { ...values };

    const onSuccess = () => {
      AppToaster.show({
        message: formatMessage({
          id: isNewMode
            ? 'the_customer_has_been_created_successfully'
            : 'the_item_customer_has_been_edited_successfully',
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

    if (isNewMode) {
      createCustomerMutate(formValues).then(onSuccess).catch(onError);
    } else {
      editCustomerMutate([customer.id, formValues])
        .then(onSuccess)
        .catch(onError);
    }
  };

  return (
    <div className={classNames(CLASSES.PAGE_FORM, CLASSES.PAGE_FORM_CUSTOMER)}>
      <Formik
        validationSchema={isNewMode ? CreateCustomerForm : EditCustomerForm}
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
)(CustomerForm);
