import React, { useState, useMemo, useCallback, useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import moment from 'moment';
import { Intent } from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import classNames from 'classnames';

import { CLASSES } from 'common/classes';
import AppToaster from 'components/AppToaster';

import CustomerFormPrimarySection from './CustomerFormPrimarySection';
import CustomerFormAfterPrimarySection from './CustomerFormAfterPrimarySection';
import CustomersTabs from 'containers/Customers/CustomersTabs';
import CustomerFloatingActions from './CustomerFloatingActions';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withCustomerDetail from 'containers/Customers/withCustomerDetail';
import withCustomersActions from 'containers/Customers/withCustomersActions';
import withMediaActions from 'containers/Media/withMediaActions';
import withCustomers from 'containers/Customers//withCustomers';
import useMedia from 'hooks/useMedia';

import { compose, transformToForm } from 'utils';

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

  // #withCustomers
  customers,

  // #withCustomerDetail
  customerDetail,

  // #withCustomersActions
  requestSubmitCustomer,
  requestEditCustomer,

  // #withMediaActions
  requestSubmitMedia,
  requestDeleteMedia,

  // #Props
  customerId,
  onFormSubmit,
  onCancelForm,
}) {
  const isNewMode = !customerId;

  const { formatMessage } = useIntl();
  const [payload, setPayload] = useState({});

  const {
    setFiles,
    saveMedia,
    deletedFiles,
    setDeletedFiles,
    deleteMedia,
  } = useMedia({
    saveCallback: requestSubmitMedia,
    deleteCallback: requestDeleteMedia,
  });

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
      ...transformToForm(customerDetail, defaultInitialValues),
    }),
    [customerDetail, defaultInitialValues],
  );

  const saveInvokeSubmit = useCallback(
    (payload) => {
      onFormSubmit && onFormSubmit(payload);
    },

    [onFormSubmit],
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
    const formValues = { ...values, status: payload.publish };

    if (customerDetail && customerDetail.id) {
      requestEditCustomer(customerDetail.id, formValues)
        .then((response) => {
          AppToaster.show({
            message: formatMessage({
              id: 'the_item_customer_has_been_successfully_edited',
            }),
            intent: Intent.SUCCESS,
          });
          setSubmitting(false);
          resetForm();
          saveInvokeSubmit({ action: 'update', ...payload });
        })
        .catch((errors) => {
          setSubmitting(false);
        });
    } else {
      requestSubmitCustomer(formValues)
        .then((response) => {
          AppToaster.show({
            message: formatMessage({
              id: 'the_customer_has_been_successfully_created',
            }),
            intent: Intent.SUCCESS,
          });
          setSubmitting(false);
          saveInvokeSubmit({ action: 'new', ...payload });
        })
        .catch((errors) => {
          setSubmitting(false);
        });
    }
  };

  const {
    setFieldValue,
    getFieldProps,
    errors,
    values,
    touched,
    isSubmitting,
    setErrors,
    handleSubmit,
  } = useFormik({
    enableReinitialize: true,
    validationSchema: validationSchema,
    initialValues: {
      ...initialValues,
    },
    onSubmit: handleFormSubmit,
  });

  const initialAttachmentFiles = useMemo(() => {
    return customerDetail && customerDetail.media
      ? customerDetail.media.map((attach) => ({
          preview: attach.attachment_file,
          upload: true,
          metadata: { ...attach },
        }))
      : [];
  }, []);

  const handleDropFiles = useCallback((_files) => {
    setFiles(_files.filter((file) => file.uploaded === false));
  }, []);

  const handleDeleteFile = useCallback(
    (_deletedFiles) => {
      _deletedFiles.forEach((deletedFile) => {
        if (deletedFile.uploaded && deletedFile.metadata.id) {
          setDeletedFiles([...deletedFiles, deletedFile.metadata.id]);
        }
      });
    },
    [setDeletedFiles, deletedFiles],
  );
  const handleSubmitClick = useCallback(
    (payload) => {
      setPayload(payload);
      handleSubmit();
    },
    [setPayload, handleSubmit],
  );

  const handleCancelClick = useCallback(
    (payload) => {
      onCancelForm && onCancelForm(payload);
    },
    [onCancelForm],
  );

  return (
    <div className={classNames(CLASSES.PAGE_FORM, CLASSES.PAGE_FORM_CUSTOMER)}>
      <form onSubmit={handleSubmit}>
        <div class={classNames(CLASSES.PAGE_FORM_HEADER)}>
          <div className={classNames(CLASSES.PAGE_FORM_HEADER_PRIMARY)}>
            <CustomerFormPrimarySection
              setFieldValue={setFieldValue}
              getFieldProps={getFieldProps}
              errors={errors}
              values={values}
              touched={touched}
            />
          </div>

          <div className={'page-form__after-priamry-section'}>
            <CustomerFormAfterPrimarySection
              setFieldValue={setFieldValue}
              getFieldProps={getFieldProps}
              errors={errors}
              values={values}
              touched={touched}
            />
          </div>
        </div>

        <div className={classNames(CLASSES.PAGE_FORM_TABS)}>
          <CustomersTabs
            setFieldValue={setFieldValue}
            getFieldProps={getFieldProps}
            errors={errors}
            values={values}
            touched={touched}
            customerId={customerDetail}
          />
        </div>
      </form>

      <CustomerFloatingActions
        isSubmitting={isSubmitting}
        onSubmitClick={handleSubmitClick}
        // customer={customer}
        onCancelClick={handleCancelClick}
        customerId={customerDetail}
      />
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
  withMediaActions,
)(CustomerForm);
