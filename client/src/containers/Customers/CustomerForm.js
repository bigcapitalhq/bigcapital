import React, { useState, useMemo, useCallback, useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  FormGroup,
  Intent,
  InputGroup,
  Checkbox,
} from '@blueprintjs/core';
import { Row, Col } from 'react-grid-system';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { pick } from 'lodash';

import AppToaster from 'components/AppToaster';
import ErrorMessage from 'components/ErrorMessage';

import CustomersTabs from 'containers/Customers/CustomersTabs';
import CustomerTypeRadioField from 'containers/Customers/CustomerTypeRadioField';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withCustomerDetail from 'containers/Customers/withCustomerDetail';
import withCustomersActions from 'containers/Customers/withCustomersActions';
import withMediaActions from 'containers/Media/withMediaActions';
import withCustomers from 'containers/Customers//withCustomers';
import useMedia from 'hooks/useMedia';

import { compose } from 'utils';
import CustomerFloatingFooter from './CustomerFooter';

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

  const formik = useFormik({
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
            // history.push('/customers');
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

  const requiredSpan = useMemo(() => <span class="required">*</span>, []);
  const handleCustomerTypeCahange = useCallback(
    (value) => {
      formik.setFieldValue('customer_type', value);
    },
    [formik.setFieldValue],
  );

  console.log(formik.values, 'ER');
  const { errors, touched, getFieldProps, values, isSubmitting } = useMemo(
    () => formik,
    [formik],
  );

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
      formik.handleSubmit();
    },
    [setPayload, formik],
  );

  const handleCancelClick = useCallback(
    (payload) => {
      onCancelForm && onCancelForm(payload);
    },
    [onCancelForm],
  );
  return (
    <div className={'customer-form'}>
      <form onSubmit={formik.handleSubmit}>
        <div className={'customer-form__primary-section'}>
          <CustomerTypeRadioField
            selectedValue={formik.values.customer_type}
            onChange={handleCustomerTypeCahange}
            className={'form-group--customer-type'}
          />

          <Row>
            <Col md={3.5} className={'form-group--contact-name'}>
              <FormGroup
                label={<T id={'contact_name'} />}
                inline={true}
                intent={
                  formik.errors.first_name &&
                  formik.touched.first_name &&
                  Intent.DANGER
                }
                helperText={
                  <ErrorMessage name={'first_name'} {...{ errors, touched }} />
                }
                // className={'form-group--contact-name'}
              >
                <InputGroup
                  placeholder={'First Name'}
                  intent={
                    formik.errors.first_name &&
                    formik.touched.first_name &&
                    Intent.DANGER
                  }
                  {...formik.getFieldProps('first_name')}
                />
              </FormGroup>
            </Col>

            <Col md={2}>
              <FormGroup
                inline={true}
                intent={
                  formik.errors.last_name &&
                  formik.touched.last_name &&
                  Intent.DANGER
                }
                helperText={
                  <ErrorMessage name={'last_name'} {...{ errors, touched }} />
                }
                // className={'form-group--contact-name'}
              >
                <InputGroup
                  placeholder={'Last Name'}
                  intent={
                    formik.errors.last_name &&
                    formik.touched.last_name &&
                    Intent.DANGER
                  }
                  {...formik.getFieldProps('last_name')}
                />
              </FormGroup>
            </Col>
          </Row>
          {/* Company Name */}
          <FormGroup
            label={<T id={'company_name'} />}
            className={'form-group--company_name'}
            labelInfo={requiredSpan}
            intent={
              formik.errors.company_name &&
              formik.touched.company_name &&
              Intent.DANGER
            }
            inline={true}
            helperText={
              <ErrorMessage {...{ errors, touched }} name={'company_name'} />
            }
          >
            <InputGroup
              intent={
                formik.errors.company_name &&
                formik.touched.company_name &&
                Intent.DANGER
              }
              {...formik.getFieldProps('company_name')}
            />
          </FormGroup>
          {/* Display Name */}
          <FormGroup
            label={<T id={'display_name'} />}
            intent={
              formik.errors.display_name &&
              formik.touched.display_name &&
              Intent.DANGER
            }
            inline={true}
            helperText={
              <ErrorMessage {...{ errors, touched }} name={'display_name'} />
            }
          >
            <InputGroup
              intent={
                formik.errors.display_name &&
                formik.touched.display_name &&
                Intent.DANGER
              }
              {...formik.getFieldProps('display_name')}
            />
          </FormGroup>
        </div>
        <Row>
          {/* Email */}
          <Col md={6}>
            <FormGroup
              label={<T id={'email'} />}
              intent={
                formik.errors.email && formik.touched.email && Intent.DANGER
              }
              helperText={
                <ErrorMessage name={'email'} {...{ errors, touched }} />
              }
              className={'form-group--email'}
              inline={true}
            >
              <InputGroup
                intent={
                  formik.errors.email && formik.touched.email && Intent.DANGER
                }
                {...formik.getFieldProps('email')}
              />
            </FormGroup>
          </Col>

          {/* Active checkbox */}
          <FormGroup label={' '} inline={true} className={'form-group--active'}>
            <Checkbox
              inline={true}
              label={<T id={'active'} />}
              defaultChecked={formik.values.active}
              {...formik.getFieldProps('active')}
            />
          </FormGroup>
        </Row>

        <FormGroup
          label={<T id={'phone_number'} />}
          intent={
            formik.errors.work_phone &&
            formik.touched.work_phone &&
            Intent.DANGER
          }
          helperText={
            <ErrorMessage name={'work_phone'} {...{ errors, touched }} />
          }
          className={'form-group--phone-number'}
          inline={true}
        >
          <InputGroup
            intent={
              formik.errors.work_phone &&
              formik.touched.work_phone &&
              Intent.DANGER
            }
            {...formik.getFieldProps('work_phone')}
          />
        </FormGroup>

        <CustomersTabs formik={formik} />
      </form>

      <CustomerFloatingFooter
        formik={formik}
        onSubmitClick={handleSubmitClick}
        customer={customer}
        onCancelClick={handleCancelClick}
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
