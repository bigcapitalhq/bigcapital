// @ts-nocheck
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import { Formik, Form } from 'formik';
import { Intent } from '@blueprintjs/core';
import classNames from 'classnames';
import styled from 'styled-components';

import { CLASSES } from '@/constants/classes';
import { AppToaster } from '@/components';
import {
  CreateVendorFormSchema,
  EditVendorFormSchema,
} from './VendorForm.schema';

import VendorTabs from './VendorsTabs';
import VendorFormPrimarySection from './VendorFormPrimarySection';
import VendorFormAfterPrimarySection from './VendorFormAfterPrimarySection';
import VendorFloatingActions from './VendorFloatingActions';

import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';

import { useVendorFormContext } from './VendorFormProvider';
import { compose, transformToForm, safeInvoke } from '@/utils';
import { defaultInitialValues } from './utils';

import '@/style/pages/Vendors/Form.scss';

/**
 * Vendor form.
 */
function VendorFormFormik({
  // #withCurrentOrganization
  organization: { base_currency },

  // #ownProps
  onSubmitSuccess,
  onSubmitError,
  onCancel,
  className,
}) {
  // Vendor form context.
  const {
    vendorId,
    vendor,
    contactDuplicate,
    createVendorMutate,
    editVendorMutate,
    setSubmitPayload,
    submitPayload,
    isNewMode,
  } = useVendorFormContext();

  /**
   * Initial values in create and edit mode.
   */
  const initialValues = useMemo(
    () => ({
      ...defaultInitialValues,
      currency_code: base_currency,
      ...transformToForm(vendor, defaultInitialValues),
      ...transformToForm(contactDuplicate, defaultInitialValues),
    }),
    [vendor, contactDuplicate, base_currency],
  );

  // Handles the form submit.
  const handleFormSubmit = (values, form) => {
    const { setSubmitting, resetForm } = form;
    const requestForm = { ...values };

    setSubmitting(true);

    const onSuccess = (response) => {
      AppToaster.show({
        message: intl.get(
          isNewMode
            ? 'the_vendor_has_been_created_successfully'
            : 'the_item_vendor_has_been_edited_successfully',
        ),
        intent: Intent.SUCCESS,
      });
      setSubmitPayload(false);
      setSubmitting(false);
      resetForm();

      safeInvoke(onSubmitSuccess, values, form, submitPayload, response);
    };

    const onError = () => {
      setSubmitPayload(false);
      setSubmitting(false);

      safeInvoke(onSubmitError, values, form, submitPayload);
    };
    if (isNewMode) {
      createVendorMutate(requestForm).then(onSuccess).catch(onError);
    } else {
      editVendorMutate([vendor.id, requestForm]).then(onSuccess).catch(onError);
    }
  };

  return (
    <div
      className={classNames(
        CLASSES.PAGE_FORM,
        CLASSES.PAGE_FORM_VENDOR,
        className,
      )}
    >
      <Formik
        validationSchema={
          isNewMode ? CreateVendorFormSchema : EditVendorFormSchema
        }
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
      >
        <Form>
          <VendorFormHeaderPrimary>
            <VendorFormPrimarySection />
          </VendorFormHeaderPrimary>

          <div className={'page-form__after-primary-section'}>
            <VendorFormAfterPrimarySection />
          </div>

          <div className={classNames(CLASSES.PAGE_FORM_TABS)}>
            <VendorTabs vendor={vendorId} />
          </div>

          <VendorFloatingActions onCancel={onCancel} />
        </Form>
      </Formik>
    </div>
  );
}

export const VendorFormHeaderPrimary = styled.div`
  padding: 10px 0 0;
  margin: 0 0 20px;
  overflow: hidden;
  border-bottom: 1px solid #e4e4e4;
  max-width: 1000px;
`;

export default compose(withCurrentOrganization())(VendorFormFormik);
