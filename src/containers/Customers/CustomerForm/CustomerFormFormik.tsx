import React, { useMemo } from 'react';
import { Formik, Form } from 'formik';
import { Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import classNames from 'classnames';

import { CLASSES } from '@/common/classes';
import AppToaster from '@/components/AppToaster';

import { CreateCustomerForm, EditCustomerForm } from './CustomerForm.schema';

import CustomerFormPrimarySection from './CustomerFormPrimarySection';
import CustomerFormAfterPrimarySection from './CustomerFormAfterPrimarySection';
import CustomersTabs from './CustomersTabs';
import CustomerFloatingActions from './CustomerFloatingActions';

import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';

import { compose, transformToForm, saveInvoke } from '@/utils';
import { useCustomerFormContext } from './CustomerFormProvider';
import { defaultInitialValues } from './utils';

import 'style/pages/Customers/Form.scss';

/**
 * Customer form.
 */
function CustomerFormFormik({
  organization: { base_currency },

  // #ownProps
  initialValues: initialCustomerValues,
  onSubmitSuccess,
  onSubmitError,
  onCancel,
  className,
}) {
  const {
    customer,
    submitPayload,
    contactDuplicate,
    editCustomerMutate,
    createCustomerMutate,
    isNewMode,
  } = useCustomerFormContext();

  /**
   * Initial values in create and edit mode.
   */
  const initialValues = useMemo(
    () => ({
      ...defaultInitialValues,
      currency_code: base_currency,
      ...transformToForm(contactDuplicate || customer, defaultInitialValues),
      ...initialCustomerValues,
    }),
    [customer, contactDuplicate, base_currency, initialCustomerValues],
  );

  // Handles the form submit.
  const handleFormSubmit = (values, formArgs) => {
    const { setSubmitting, resetForm } = formArgs;
    const formValues = { ...values };

    const onSuccess = () => {
      AppToaster.show({
        message: intl.get(
          isNewMode
            ? 'the_customer_has_been_created_successfully'
            : 'the_item_customer_has_been_edited_successfully',
        ),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);
      resetForm();

      saveInvoke(onSubmitSuccess, values, formArgs, submitPayload);
    };

    const onError = () => {
      setSubmitting(false);
      saveInvoke(onSubmitError, values, formArgs, submitPayload);
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
    <div
      className={classNames(
        CLASSES.PAGE_FORM,
        CLASSES.PAGE_FORM_CUSTOMER,
        className,
      )}
    >
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

          <CustomerFloatingActions onCancel={onCancel} />
        </Form>
      </Formik>
    </div>
  );
}

export default compose(withCurrentOrganization())(CustomerFormFormik);
