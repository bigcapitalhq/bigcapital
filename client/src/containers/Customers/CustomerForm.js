import React, { useState, useMemo, useCallback, useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Intent } from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { pick } from 'lodash';
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

import { compose } from 'utils';

function CustomerForm({
  // #withDashboardActions
  changePageTitle,

  // #withCustomers
  customers,

  // #withCustomerDetail
  customer,

  // #withCustomersActions
  requestSubmitCustomer,
  requestFetchCustomers,
  requestEditCustomer,

  // #withMediaActions
  requestSubmitMedia,
  requestDeleteMedia,

  // #Props
  onFormSubmit,
  onCancelForm,
}) {
  const { formatMessage } = useIntl();
  const history = useHistory();
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
    first_name: Yup.string().trim(),
    last_name: Yup.string().trim(),
    company_name: Yup.string().trim(),
    display_name: Yup.string()
      .trim()
      .required()
      .label(formatMessage({ id: 'display_name_' })),
    email: Yup.string().email(),

    work_phone: Yup.number(),
    active: Yup.boolean(),

    billing_address_city: Yup.string().trim(),
    billing_address_country: Yup.string().trim(),
    billing_address_email: Yup.string().email(),
    billing_address_zipcode: Yup.number().nullable(),
    billing_address_phone: Yup.number(),
    billing_address_state: Yup.string().trim(),

    shipping_address_city: Yup.string().trim(),
    shipping_address_country: Yup.string().trim(),
    shipping_address_email: Yup.string().email(),
    shipping_address_zipcode: Yup.number().nullable(),
    shipping_address_phone: Yup.number(),
    shipping_address_state: Yup.string().trim(),
  });

  const defaultInitialValues = useMemo(
    () => ({
      customer_type: 'business',
      first_name: '',
      last_name: '',
      company_name: '',
      display_name: '',
      email: '',
      work_phone: '',
      active: true,

      billing_address_city: '',
      billing_address_country: '',
      billing_address_zipcode: null,
      billing_address_phone: '',
      billing_address_state: '',

      shipping_address_city: '',
      shipping_address_country: '',
      shipping_address_zipcode: null,
      shipping_address_phone: '',
      shipping_address_state: '',
    }),
    [],
  );

  const initialValues = useMemo(
    () => ({
      ...(customer
        ? {
            ...pick(customer, Object.keys(defaultInitialValues)),
          }
        : {
            ...defaultInitialValues,
          }),
    }),
    [customer, defaultInitialValues],
  );

  const saveInvokeSubmit = useCallback(
    (payload) => {
      onFormSubmit && onFormSubmit(payload);
    },

    [onFormSubmit],
  );

  useEffect(() => {
    customer && customer.id
      ? changePageTitle(formatMessage({ id: 'edit_customer_details' }))
      : changePageTitle(formatMessage({ id: 'new_customer' }));
  }, [changePageTitle, customer, formatMessage]);

  const {
    setFieldValue,
    getFieldProps,
    errors,
    values,
    touched,
    handleSubmit
  } = useFormik({
    enableReinitialize: true,
    validationSchema: validationSchema,
    initialValues: {
      ...initialValues,
    },
    onSubmit: (values, { setSubmitting, resetForm, setErrors }) => {
      const formValues = { ...values, status: payload.publish };
      if (customer && customer.id) {
        requestEditCustomer(customer.id, formValues)
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
            // history.push('/customers');
            setSubmitting(false);
            saveInvokeSubmit({ action: 'new', ...payload });
          })
          .catch((errors) => {
            setSubmitting(false);
          });
      }
    },
  });

 
  const initialAttachmentFiles = useMemo(() => {
    return customer && customer.media
      ? customer.media.map((attach) => ({
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
            touched={touched} />
        </div>

        <CustomerFloatingActions
          onSubmitClick={handleSubmitClick}
          customer={customer}
          onCancelClick={handleCancelClick}
          customerId={null}
        />
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
  withMediaActions,
)(CustomerForm);
